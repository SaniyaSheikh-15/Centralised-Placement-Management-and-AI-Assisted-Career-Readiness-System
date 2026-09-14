from typing import Optional

from sqlalchemy import bindparam, text
from sqlalchemy.orm import Session


# =========================================================
# COMMON HELPERS
# =========================================================

# These are the actual active placement-drive statuses
# used by the database schema.
ACTIVE_DRIVE_STATUSES = [
    "PUBLISHED",
    "ONGOING",
]


def _execute_active(
    db: Session,
    query: str,
    params: Optional[dict] = None,
):
    """
    Execute a SQL query.

    If the query contains :active_statuses, SQLAlchemy is
    configured to expand the list into individual parameters.

    Queries that do not use :active_statuses are executed
    normally.
    """

    if params is None:
        params = {}

    if ":active_statuses" in query:
        statement = text(query).bindparams(
            bindparam(
                "active_statuses",
                expanding=True,
            )
        )

        params.setdefault(
            "active_statuses",
            ACTIVE_DRIVE_STATUSES,
        )

    else:
        statement = text(query)

    return db.execute(
        statement,
        params,
    ).fetchall()


def _percentage(
    numerator: int,
    denominator: int,
) -> float:
    """
    Safely calculate percentage.
    """

    if denominator == 0:
        return 0.0

    return round(
        (numerator / denominator) * 100,
        2,
    )


def _eligibility_condition(
    drive_alias: str = "pd",
    rule_alias: str = "er",
) -> str:
    """
    Common eligibility condition for a student against
    a placement drive.

    A student is considered eligible when:

    - CGPA satisfies minimum CGPA
    - Active backlogs are within maximum allowed backlogs
    - Graduation year matches the drive
    - Student's branch is allowed for the drive
    - Required skills and proficiency are satisfied
    """

    return f"""
        sp.cgpa >= COALESCE(
            {rule_alias}.minimum_cgpa,
            0
        )

        AND sp.active_backlogs <= COALESCE(
            {rule_alias}.maximum_backlogs,
            999
        )

        AND sp.graduation_year =
            {rule_alias}.graduation_year

        AND EXISTS (
            SELECT 1
            FROM drive_branches db_allowed
            WHERE db_allowed.drive_id =
                  {drive_alias}.drive_id

              AND db_allowed.branch_id =
                  sp.branch_id
        )

        AND NOT EXISTS (
            SELECT 1
            FROM drive_skills ds_required

            LEFT JOIN student_skills ss_student
                ON ss_student.student_id =
                   sp.student_id

               AND ss_student.skill_id =
                   ds_required.skill_id

            WHERE ds_required.drive_id =
                  {drive_alias}.drive_id

              AND (
                    ss_student.student_skill_id IS NULL

                    OR

                    CASE
                        WHEN UPPER(
                            COALESCE(
                                ss_student.proficiency_level,
                                'BEGINNER'
                            )
                        ) = 'BEGINNER'
                            THEN 1

                        WHEN UPPER(
                            COALESCE(
                                ss_student.proficiency_level,
                                'BEGINNER'
                            )
                        ) = 'INTERMEDIATE'
                            THEN 2

                        WHEN UPPER(
                            COALESCE(
                                ss_student.proficiency_level,
                                'BEGINNER'
                            )
                        ) = 'ADVANCED'
                            THEN 3

                        WHEN UPPER(
                            COALESCE(
                                ss_student.proficiency_level,
                                'BEGINNER'
                            )
                        ) = 'EXPERT'
                            THEN 4

                        ELSE 1
                    END

                    <

                    CASE
                        WHEN UPPER(
                            COALESCE(
                                ds_required.minimum_proficiency,
                                'BEGINNER'
                            )
                        ) = 'BEGINNER'
                            THEN 1

                        WHEN UPPER(
                            COALESCE(
                                ds_required.minimum_proficiency,
                                'BEGINNER'
                            )
                        ) = 'INTERMEDIATE'
                            THEN 2

                        WHEN UPPER(
                            COALESCE(
                                ds_required.minimum_proficiency,
                                'BEGINNER'
                            )
                        ) = 'ADVANCED'
                            THEN 3

                        WHEN UPPER(
                            COALESCE(
                                ds_required.minimum_proficiency,
                                'BEGINNER'
                            )
                        ) = 'EXPERT'
                            THEN 4

                        ELSE 1
                    END
              )
        )
    """


# =========================================================
# OVERVIEW
# =========================================================

def get_overview(db: Session):
    """
    Returns the main Placement Officer dashboard KPIs.
    """

    total_students_query = """
        SELECT COUNT(*) AS total_students
        FROM student_profiles
    """

    total_students_result = _execute_active(
        db,
        total_students_query,
    )

    total_students = int(
        total_students_result[0].total_students or 0
    )

    active_drives_query = """
        SELECT COUNT(*) AS active_drives
        FROM placement_drives
        WHERE status IN :active_statuses
    """

    active_drives_result = _execute_active(
        db,
        active_drives_query,
    )

    active_drives = int(
        active_drives_result[0].active_drives or 0
    )

    applications_query = """
        SELECT COUNT(*) AS total_applications
        FROM applications
    """

    applications_result = _execute_active(
        db,
        applications_query,
    )

    total_applications = int(
        applications_result[0].total_applications or 0
    )

    placed_query = """
        SELECT COUNT(DISTINCT a.student_id)
            AS students_placed

        FROM applications a

        JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        WHERE pr.final_status = 'SELECTED'
    """

    placed_result = _execute_active(
        db,
        placed_query,
    )

    students_placed = int(
        placed_result[0].students_placed or 0
    )

    eligible_query = f"""
        SELECT COUNT(DISTINCT sp.student_id)
            AS eligible_students

        FROM student_profiles sp

        WHERE EXISTS (
            SELECT 1
            FROM placement_drives pd

            JOIN eligibility_rules er
                ON er.drive_id =
                   pd.drive_id

            WHERE pd.status IN :active_statuses

              AND {_eligibility_condition("pd", "er")}
        )
    """

    eligible_result = _execute_active(
        db,
        eligible_query,
    )

    eligible_students = int(
        eligible_result[0].eligible_students or 0
    )

    placement_rate = _percentage(
        students_placed,
        total_students,
    )

    return {
        "total_students": total_students,
        "eligible_students": eligible_students,
        "active_drives": active_drives,
        "total_applications": total_applications,
        "students_placed": students_placed,
        "placement_rate": placement_rate,
    }


# =========================================================
# PLACEMENTS
# =========================================================

def get_placements(db: Session):
    """
    Returns placement count and package statistics.
    """

    query = """
        SELECT
            COUNT(DISTINCT a.student_id)
                FILTER (
                    WHERE pr.final_status =
                          'SELECTED'
                ) AS students_placed,

            AVG(pr.offered_package)
                FILTER (
                    WHERE pr.final_status =
                          'SELECTED'

                      AND pr.offered_package IS NOT NULL
                ) AS average_package,

            MAX(pr.offered_package)
                FILTER (
                    WHERE pr.final_status =
                          'SELECTED'

                      AND pr.offered_package IS NOT NULL
                ) AS highest_package,

            MIN(pr.offered_package)
                FILTER (
                    WHERE pr.final_status =
                          'SELECTED'

                      AND pr.offered_package IS NOT NULL
                ) AS lowest_package

        FROM applications a

        LEFT JOIN placement_results pr
            ON pr.application_id =
               a.application_id
    """

    result = _execute_active(
        db,
        query,
    )

    row = result[0]

    students_placed = int(
        row.students_placed or 0
    )

    total_students_query = """
        SELECT COUNT(*) AS total_students
        FROM student_profiles
    """

    total_students_result = _execute_active(
        db,
        total_students_query,
    )

    total_students = int(
        total_students_result[0].total_students or 0
    )

    return {
        "students_placed": students_placed,

        "placement_rate": _percentage(
            students_placed,
            total_students,
        ),

        "average_package": (
            round(
                float(row.average_package),
                2,
            )
            if row.average_package is not None
            else None
        ),

        "highest_package": (
            float(row.highest_package)
            if row.highest_package is not None
            else None
        ),

        "lowest_package": (
            float(row.lowest_package)
            if row.lowest_package is not None
            else None
        ),
    }


# =========================================================
# APPLICATIONS
# =========================================================

def get_applications(db: Session):
    """
    Returns total applications and selected applications.
    """

    query = """
        SELECT
            COUNT(*) AS total_applications,

            COUNT(*) FILTER (
                WHERE pr.final_status =
                      'SELECTED'
            ) AS selected_applications

        FROM applications a

        LEFT JOIN placement_results pr
            ON pr.application_id =
               a.application_id
    """

    result = _execute_active(
        db,
        query,
    )

    row = result[0]

    total_applications = int(
        row.total_applications or 0
    )

    selected_applications = int(
        row.selected_applications or 0
    )

    return {
        "total_applications":
            total_applications,

        "selected_applications":
            selected_applications,

        "selection_rate": _percentage(
            selected_applications,
            total_applications,
        ),
    }


# =========================================================
# HIRING TRENDS
# =========================================================

def get_hiring_trends(db: Session):
    """
    Returns monthly application and selection trends.
    """

    query = """
        SELECT
            TO_CHAR(
                DATE_TRUNC(
                    'month',
                    a.applied_at
                ),
                'YYYY-MM'
            ) AS month,

            COUNT(
                a.application_id
            ) AS applications,

            COUNT(*) FILTER (
                WHERE pr.final_status =
                      'SELECTED'
            ) AS selections

        FROM applications a

        LEFT JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        GROUP BY DATE_TRUNC(
            'month',
            a.applied_at
        )

        ORDER BY DATE_TRUNC(
            'month',
            a.applied_at
        )
    """

    result = _execute_active(
        db,
        query,
    )

    return [
        {
            "month": row.month,

            "applications": int(
                row.applications or 0
            ),

            "selections": int(
                row.selections or 0
            ),
        }
        for row in result
    ]


# =========================================================
# DEPARTMENT-WISE PLACEMENT
# =========================================================

def get_department_wise(db: Session):
    """
    Returns placement statistics department-wise.
    """

    query = """
        SELECT
            b.department,

            COUNT(
                DISTINCT sp.student_id
            ) AS total_students,

            COUNT(
                DISTINCT CASE
                    WHEN pr.final_status =
                         'SELECTED'
                    THEN sp.student_id
                END
            ) AS students_placed

        FROM student_profiles sp

        JOIN branches b
            ON b.branch_id =
               sp.branch_id

        LEFT JOIN applications a
            ON a.student_id =
               sp.student_id

        LEFT JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        GROUP BY b.department

        ORDER BY b.department
    """

    result = _execute_active(
        db,
        query,
    )

    response = []

    for row in result:

        total_students = int(
            row.total_students or 0
        )

        students_placed = int(
            row.students_placed or 0
        )

        response.append(
            {
                "department":
                    row.department,

                "total_students":
                    total_students,

                "students_placed":
                    students_placed,

                "placement_rate":
                    _percentage(
                        students_placed,
                        total_students,
                    ),
            }
        )

    return response


# =========================================================
# YEAR-WISE PLACEMENT
# =========================================================

def get_year_wise(db: Session):
    """
    Returns placement statistics by graduation year.
    """

    query = """
        SELECT
            sp.graduation_year,

            COUNT(
                DISTINCT sp.student_id
            ) AS total_students,

            COUNT(
                DISTINCT CASE
                    WHEN pr.final_status =
                         'SELECTED'
                    THEN sp.student_id
                END
            ) AS students_placed

        FROM student_profiles sp

        LEFT JOIN applications a
            ON a.student_id =
               sp.student_id

        LEFT JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        GROUP BY sp.graduation_year

        ORDER BY sp.graduation_year
    """

    result = _execute_active(
        db,
        query,
    )

    response = []

    for row in result:

        total_students = int(
            row.total_students or 0
        )

        students_placed = int(
            row.students_placed or 0
        )

        response.append(
            {
                "graduation_year":
                    int(row.graduation_year),

                "total_students":
                    total_students,

                "students_placed":
                    students_placed,

                "placement_rate":
                    _percentage(
                        students_placed,
                        total_students,
                    ),
            }
        )

    return response


# =========================================================
# COMPANY-WISE HIRING
# =========================================================

def get_company_wise(db: Session):
    """
    Returns company-wise placement statistics.
    """

    query = """
        SELECT
            c.company_name,

            COUNT(
                DISTINCT a.student_id
            ) FILTER (
                WHERE pr.final_status =
                      'SELECTED'
            ) AS students_placed,

            AVG(pr.offered_package)
                FILTER (
                    WHERE pr.final_status =
                          'SELECTED'

                      AND pr.offered_package IS NOT NULL
                ) AS average_package

        FROM companies c

        JOIN placement_drives pd
            ON pd.company_id =
               c.company_id

        JOIN applications a
            ON a.drive_id =
               pd.drive_id

        JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        GROUP BY c.company_name

        HAVING COUNT(
            DISTINCT a.student_id
        ) FILTER (
            WHERE pr.final_status =
                  'SELECTED'
        ) > 0

        ORDER BY
            students_placed DESC,
            c.company_name
    """

    result = _execute_active(
        db,
        query,
    )

    return [
        {
            "company_name":
                row.company_name,

            "students_placed":
                int(row.students_placed or 0),

            "average_package": (
                round(
                    float(row.average_package),
                    2,
                )
                if row.average_package is not None
                else None
            ),
        }
        for row in result
    ]


# =========================================================
# ELIGIBLE STUDENTS
# =========================================================

def get_eligible_students(
    db: Session,
    department: Optional[str] = None,
    min_cgpa: Optional[float] = None,
    company: Optional[str] = None,
    branch: Optional[str] = None,
    placement_status: Optional[str] = None,
    academic_year: Optional[str] = None,
):
    """
    Returns students eligible for at least one
    active placement drive.

    Supported filters:

    - department
    - minimum CGPA
    - company
    - branch code/name
    - placement status
    - academic year
    """

    query = f"""
        SELECT
            sp.student_id,

            CONCAT(
                COALESCE(
                    u.first_name,
                    ''
                ),

                CASE
                    WHEN u.last_name IS NOT NULL
                     AND u.last_name <> ''
                    THEN ' ' || u.last_name

                    ELSE ''
                END
            ) AS student_name,

            b.department,

            b.branch_code AS branch,

            sp.cgpa,

            (
                SELECT
                    c_selected.company_name

                FROM applications a_selected

                JOIN placement_drives pd_selected
                    ON pd_selected.drive_id =
                       a_selected.drive_id

                JOIN companies c_selected
                    ON c_selected.company_id =
                       pd_selected.company_id

                JOIN placement_results pr_selected
                    ON pr_selected.application_id =
                       a_selected.application_id

                WHERE a_selected.student_id =
                      sp.student_id

                  AND pr_selected.final_status =
                      'SELECTED'

                ORDER BY
                    pr_selected.joining_date
                    NULLS LAST

                LIMIT 1
            ) AS company,

            CONCAT(
                sp.graduation_year - 1,
                '-',
                RIGHT(
                    CAST(
                        sp.graduation_year
                        AS VARCHAR
                    ),
                    2
                )
            ) AS academic_year,

            (
                SELECT COUNT(
                    DISTINCT pd_count.drive_id
                )

                FROM placement_drives pd_count

                JOIN eligibility_rules er_count
                    ON er_count.drive_id =
                       pd_count.drive_id

                WHERE pd_count.status IN
                      :active_statuses

                  AND {_eligibility_condition(
                      "pd_count",
                      "er_count"
                  )}
            ) AS eligible_drives,

            (
                SELECT COUNT(*)

                FROM applications a_count

                WHERE a_count.student_id =
                      sp.student_id
            ) AS applications,

            (
                SELECT
                    ir_latest.round_status

                FROM interview_rounds ir_latest

                JOIN applications a_interview
                    ON a_interview.application_id =
                       ir_latest.application_id

                WHERE a_interview.student_id =
                      sp.student_id

                ORDER BY
                    ir_latest.interview_date
                    DESC NULLS LAST

                LIMIT 1
            ) AS interview_status,

            CASE

                WHEN EXISTS (
                    SELECT 1

                    FROM applications
                        a_selected_status

                    JOIN placement_results
                        pr_selected_status

                        ON pr_selected_status
                           .application_id =
                           a_selected_status
                           .application_id

                    WHERE
                        a_selected_status.student_id =
                        sp.student_id

                      AND pr_selected_status
                          .final_status =
                          'SELECTED'
                )

                THEN 'SELECTED'


                WHEN EXISTS (
                    SELECT 1

                    FROM applications
                        a_rejected_status

                    JOIN placement_results
                        pr_rejected_status

                        ON pr_rejected_status
                           .application_id =
                           a_rejected_status
                           .application_id

                    WHERE
                        a_rejected_status.student_id =
                        sp.student_id

                      AND pr_rejected_status
                          .final_status =
                          'REJECTED'
                )

                THEN 'REJECTED'


                ELSE 'IN_PROGRESS'

            END AS placement_status


        FROM student_profiles sp


        JOIN users u
            ON u.user_id =
               sp.user_id


        JOIN branches b
            ON b.branch_id =
               sp.branch_id


        WHERE EXISTS (

            SELECT 1

            FROM placement_drives pd

            JOIN eligibility_rules er
                ON er.drive_id =
                   pd.drive_id

            WHERE pd.status IN
                  :active_statuses

              AND {_eligibility_condition(
                  "pd",
                  "er"
              )}

        )


        AND (
            :department IS NULL

            OR :department = ''

            OR LOWER(b.department) =
               LOWER(:department)
        )


        AND (
            :min_cgpa IS NULL

            OR sp.cgpa >= :min_cgpa
        )


        AND (
            :branch IS NULL

            OR :branch = ''

            OR LOWER(b.branch_code) =
               LOWER(:branch)

            OR LOWER(b.branch_name) =
               LOWER(:branch)
        )


        AND (
            :academic_year IS NULL

            OR :academic_year = ''

            OR sp.graduation_year =
                CAST(
                    SPLIT_PART(
                        :academic_year,
                        '-',
                        1
                    ) AS INTEGER
                ) + 1
        )


        AND (
            :company IS NULL

            OR :company = ''

            OR EXISTS (

                SELECT 1

                FROM applications
                    a_company_filter

                JOIN placement_drives
                    pd_company_filter

                    ON pd_company_filter.drive_id =
                       a_company_filter.drive_id

                JOIN companies
                    c_company_filter

                    ON c_company_filter.company_id =
                       pd_company_filter.company_id

                WHERE
                    a_company_filter.student_id =
                    sp.student_id

                  AND LOWER(
                      c_company_filter.company_name
                  ) = LOWER(:company)

            )
        )


        AND (
            :placement_status IS NULL

            OR :placement_status = ''

            OR (

                CASE

                    WHEN EXISTS (

                        SELECT 1

                        FROM applications
                            a_ps_selected

                        JOIN placement_results
                            pr_ps_selected

                            ON pr_ps_selected
                               .application_id =
                               a_ps_selected
                               .application_id

                        WHERE
                            a_ps_selected.student_id =
                            sp.student_id

                          AND pr_ps_selected
                              .final_status =
                              'SELECTED'
                    )

                    THEN 'SELECTED'


                    WHEN EXISTS (

                        SELECT 1

                        FROM applications
                            a_ps_rejected

                        JOIN placement_results
                            pr_ps_rejected

                            ON pr_ps_rejected
                               .application_id =
                               a_ps_rejected
                               .application_id

                        WHERE
                            a_ps_rejected.student_id =
                            sp.student_id

                          AND pr_ps_rejected
                              .final_status =
                              'REJECTED'
                    )

                    THEN 'REJECTED'


                    ELSE 'IN_PROGRESS'

                END

            ) = :placement_status
        )


        ORDER BY sp.student_id
    """

    params = {
        "department":
            department,

        "min_cgpa":
            min_cgpa,

        "company":
            company,

        "branch":
            branch,

        "placement_status":
            placement_status,

        "academic_year":
            academic_year,
    }

    result = _execute_active(
        db,
        query,
        params,
    )

    response = []

    for row in result:

        response.append(
            {
                "student_id":
                    row.student_id,

                "student_name":
                    row.student_name,

                "department":
                    row.department,

                "branch":
                    row.branch,

                "cgpa": (
                    float(row.cgpa)
                    if row.cgpa is not None
                    else None
                ),

                "company":
                    row.company,

                "academic_year":
                    row.academic_year,

                "eligible_drives":
                    int(
                        row.eligible_drives or 0
                    ),

                "applications":
                    int(
                        row.applications or 0
                    ),

                "interview_status":
                    row.interview_status,

                "placement_status":
                    row.placement_status,
            }
        )

    return response


# =========================================================
# SALARY DISTRIBUTION
# =========================================================

def get_salary_distribution(db: Session):
    """
    Returns number of placed students in each
    salary range.
    """

    query = """
        SELECT

            CASE

                WHEN pr.offered_package < 5
                    THEN '< 5 LPA'

                WHEN pr.offered_package >= 5
                 AND pr.offered_package < 10
                    THEN '5 - 10 LPA'

                WHEN pr.offered_package >= 10
                 AND pr.offered_package < 15
                    THEN '10 - 15 LPA'

                WHEN pr.offered_package >= 15
                 AND pr.offered_package < 20
                    THEN '15 - 20 LPA'

                ELSE '20+ LPA'

            END AS salary_range,

            COUNT(*) AS students

        FROM placement_results pr

        WHERE pr.final_status =
              'SELECTED'

          AND pr.offered_package IS NOT NULL

        GROUP BY

            CASE

                WHEN pr.offered_package < 5
                    THEN '< 5 LPA'

                WHEN pr.offered_package >= 5
                 AND pr.offered_package < 10
                    THEN '5 - 10 LPA'

                WHEN pr.offered_package >= 10
                 AND pr.offered_package < 15
                    THEN '10 - 15 LPA'

                WHEN pr.offered_package >= 15
                 AND pr.offered_package < 20
                    THEN '15 - 20 LPA'

                ELSE '20+ LPA'

            END

        ORDER BY MIN(
            pr.offered_package
        )
    """

    result = _execute_active(
        db,
        query,
    )

    return [
        {
            "salary_range":
                row.salary_range,

            "students":
                int(row.students or 0),
        }
        for row in result
    ]


# =========================================================
# ROLE OFFERS
# =========================================================

def get_role_offers(db: Session):
    """
    Returns number of selected students by job role.
    """

    query = """
        SELECT

            jr.role_title AS role,

            COUNT(*) AS offers

        FROM placement_results pr

        JOIN applications a
            ON a.application_id =
               pr.application_id

        JOIN placement_drives pd
            ON pd.drive_id =
               a.drive_id

        JOIN job_roles jr
            ON jr.job_role_id =
               pd.job_role_id

        WHERE pr.final_status =
              'SELECTED'

        GROUP BY jr.role_title

        ORDER BY offers DESC
    """

    result = _execute_active(
        db,
        query,
    )

    return [
        {
            "role":
                row.role,

            "offers":
                int(row.offers or 0),
        }
        for row in result
    ]


# =========================================================
# COMPANY RECRUITMENT TRENDS
# =========================================================

def get_company_recruitment_trends(db: Session):
    """
    Returns monthly recruitment count by company.
    """

    query = """
        SELECT

            TO_CHAR(
                DATE_TRUNC(
                    'month',
                    a.applied_at
                ),
                'YYYY-MM'
            ) AS month,

            c.company_name,

            COUNT(*) AS recruitments

        FROM applications a

        JOIN placement_drives pd
            ON pd.drive_id =
               a.drive_id

        JOIN companies c
            ON c.company_id =
               pd.company_id

        JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        WHERE pr.final_status =
              'SELECTED'

        GROUP BY

            DATE_TRUNC(
                'month',
                a.applied_at
            ),

            c.company_name

        ORDER BY

            DATE_TRUNC(
                'month',
                a.applied_at
            ),

            c.company_name
    """

    result = _execute_active(
        db,
        query,
    )

    return [
        {
            "month":
                row.month,

            "company_name":
                row.company_name,

            "recruitments":
                int(
                    row.recruitments or 0
                ),
        }
        for row in result
    ]


# =========================================================
# HIRING UPDATES
# =========================================================

def get_hiring_updates(db: Session):
    """
    Returns company-wise selected student counts.
    """

    query = """
        SELECT

            c.company_name AS company,

            COUNT(*) AS selected

        FROM placement_results pr

        JOIN applications a
            ON a.application_id =
               pr.application_id

        JOIN placement_drives pd
            ON pd.drive_id =
               a.drive_id

        JOIN companies c
            ON c.company_id =
               pd.company_id

        WHERE pr.final_status =
              'SELECTED'

        GROUP BY c.company_name

        ORDER BY
            selected DESC,
            c.company_name
    """

    result = _execute_active(
        db,
        query,
    )

    return [
        {
            "company":
                row.company,

            "selected":
                int(row.selected or 0),
        }
        for row in result
    ]


# =========================================================
# DRIVE STATISTICS
# =========================================================

def get_drive_statistics(db: Session):
    """
    Returns application and selection statistics
    for each placement drive.
    """

    query = """
        SELECT

            pd.drive_id,

            c.company_name,

            pd.drive_title,

            pd.status,

            COUNT(
                DISTINCT a.application_id
            ) AS applications,

            COUNT(
                DISTINCT CASE
                    WHEN pr.final_status =
                         'SELECTED'
                    THEN a.application_id
                END
            ) AS selected,

            pd.vacancies,

            pd.drive_date

        FROM placement_drives pd

        JOIN companies c
            ON c.company_id =
               pd.company_id

        LEFT JOIN applications a
            ON a.drive_id =
               pd.drive_id

        LEFT JOIN placement_results pr
            ON pr.application_id =
               a.application_id

        GROUP BY

            pd.drive_id,

            c.company_name,

            pd.drive_title,

            pd.status,

            pd.vacancies,

            pd.drive_date

        ORDER BY
            pd.drive_date
            DESC NULLS LAST
    """

    result = _execute_active(
        db,
        query,
    )

    response = []

    for row in result:

        applications = int(
            row.applications or 0
        )

        selected = int(
            row.selected or 0
        )

        selection_rate = _percentage(
            selected,
            applications,
        )

        response.append(
            {
                "drive_id":
                    row.drive_id,

                "company_name":
                    row.company_name,

                "drive_title":
                    row.drive_title,

                "status":
                    row.status,

                "applications":
                    applications,

                "selected":
                    selected,

                "selection_rate":
                    selection_rate,

                "vacancies": (
                    int(row.vacancies)
                    if row.vacancies is not None
                    else None
                ),
            }
        )

    return response


# =========================================================
# PLACEMENT INSIGHTS
# =========================================================

def get_placement_insights(db: Session):
    """
    Generates rule-based placement insights from
    PostgreSQL analytics.

    No external AI or OpenAI API is used.

    The function combines existing analytics results
    and applies predefined business rules to generate:

    1. Placement Performance
    2. Attention Required
    3. Recommendations
    """

    # -----------------------------------------------------
    # Fetch existing analytics
    # -----------------------------------------------------

    overview = get_overview(db)

    placements = get_placements(db)

    applications = get_applications(db)

    departments = get_department_wise(db)

    companies = get_company_wise(db)

    eligible_students = get_eligible_students(db)

    hiring_trends = get_hiring_trends(db)

    # -----------------------------------------------------
    # Result containers
    # -----------------------------------------------------

    placement_performance = []

    attention_required = []

    recommendations = []

    # =====================================================
    # 1. PLACEMENT PERFORMANCE
    # =====================================================

    total_students = overview["total_students"]

    students_placed = overview["students_placed"]

    placement_rate = overview["placement_rate"]

    average_package = placements["average_package"]

    highest_package = placements["highest_package"]

    lowest_package = placements["lowest_package"]

    total_applications = applications["total_applications"]

    selection_rate = applications["selection_rate"]

    # Overall placement performance

    if total_students == 0:

        placement_performance.append(
            "No student placement data is currently available."
        )

    else:

        placement_performance.append(
            f"Overall placement rate is "
            f"{placement_rate:.2f}% with "
            f"{students_placed} students placed out of "
            f"{total_students} students."
        )

    # Package performance

    if average_package is not None:

        package_message = (
            f"The average offered package is "
            f"{average_package:.2f} LPA"
        )

        if highest_package is not None:

            package_message += (
                f", with the highest package at "
                f"{highest_package:.2f} LPA"
            )

        if lowest_package is not None:

            package_message += (
                f" and the lowest package at "
                f"{lowest_package:.2f} LPA."
            )

        else:

            package_message += "."

        placement_performance.append(
            package_message
        )

    # Application performance

    if total_applications > 0:

        placement_performance.append(
            f"There are {total_applications} total "
            f"applications with a selection rate of "
            f"{selection_rate:.2f}%."
        )

    # Department performance

    departments_with_students = [
        department
        for department in departments
        if department["total_students"] > 0
    ]

    if departments_with_students:

        strongest_department = max(
            departments_with_students,
            key=lambda item: (
                item["placement_rate"],
                item["students_placed"],
            ),
        )

        weakest_department = min(
            departments_with_students,
            key=lambda item: (
                item["placement_rate"],
                item["students_placed"],
            ),
        )

        placement_performance.append(
            f"{strongest_department['department']} "
            f"has the highest department placement rate "
            f"at {strongest_department['placement_rate']:.2f}%."
        )

        if (
            weakest_department["department"]
            != strongest_department["department"]
        ):

            placement_performance.append(
                f"{weakest_department['department']} "
                f"has the lowest department placement rate "
                f"at {weakest_department['placement_rate']:.2f}%."
            )

    # Company performance

    if companies:

        top_company = companies[0]

        placement_performance.append(
            f"{top_company['company_name']} currently has "
            f"the highest number of student placements "
            f"with {top_company['students_placed']} "
            f"selected students."
        )

    # =====================================================
    # 2. ATTENTION REQUIRED
    # =====================================================

    # Eligible students without applications

    inactive_eligible_students = [
        student
        for student in eligible_students
        if student["applications"] == 0
    ]

    inactive_count = len(
        inactive_eligible_students
    )

    if inactive_count > 0:

        attention_required.append(
            f"{inactive_count} eligible student"
            f"{'s' if inactive_count != 1 else ''} "
            f"{'have' if inactive_count != 1 else 'has'} "
            f"eligible placement opportunities but "
            f"no application activity."
        )

    # Eligible students who are not selected

    unplaced_eligible_students = [
        student
        for student in eligible_students
        if student["placement_status"]
        != "SELECTED"
    ]

    unplaced_count = len(
        unplaced_eligible_students
    )

    if unplaced_count > 0:

        attention_required.append(
            f"{unplaced_count} eligible student"
            f"{'s' if unplaced_count != 1 else ''} "
            f"{'are' if unplaced_count != 1 else 'is'} "
            f"currently not placed."
        )

    # Rejected eligible students

    rejected_students = [
        student
        for student in eligible_students
        if student["placement_status"]
        == "REJECTED"
    ]

    rejected_count = len(
        rejected_students
    )

    if rejected_count > 0:

        attention_required.append(
            f"{rejected_count} eligible student"
            f"{'s' if rejected_count != 1 else ''} "
            f"{'have' if rejected_count != 1 else 'has'} "
            f"experienced a rejected placement outcome "
            f"and may benefit from additional preparation."
        )

    # Low-performing departments

    low_performing_departments = [
        department
        for department in departments_with_students
        if department["placement_rate"] < 50
    ]

    for department in low_performing_departments:

        attention_required.append(
            f"{department['department']} has a "
            f"placement rate of "
            f"{department['placement_rate']:.2f}%, "
            f"which requires attention."
        )

    # Applications vs selections

    if (
        total_applications > 0
        and selection_rate < 50
    ):

        attention_required.append(
            f"The application selection rate is only "
            f"{selection_rate:.2f}%, indicating a potential "
            f"gap in resume quality, interview readiness, "
            f"or role matching."
        )

    # No issues found

    if not attention_required:

        attention_required.append(
            "No major placement attention areas "
            "were identified from the current analytics."
        )

    # =====================================================
    # 3. RECOMMENDATIONS
    # =====================================================

    # Low placement rate

    if placement_rate < 50:

        recommendations.append(
            "Conduct targeted placement preparation "
            "programs covering aptitude, technical skills, "
            "resume building, and interview preparation."
        )

    elif placement_rate < 75:

        recommendations.append(
            "Strengthen placement preparation and employer "
            "engagement to improve the current placement rate."
        )

    else:

        recommendations.append(
            "Maintain the current placement strategy while "
            "expanding opportunities with additional employers."
        )

    # Inactive eligible students

    if inactive_count > 0:

        recommendations.append(
            "Encourage eligible students with no applications "
            "to actively participate in suitable placement drives."
        )

    # Low-performing departments

    if low_performing_departments:

        recommendations.append(
            "Provide department-specific training and "
            "career-readiness support to departments with "
            "placement rates below 50%."
        )

    # Low selection rate

    if (
        total_applications > 0
        and selection_rate < 50
    ):

        recommendations.append(
            "Improve resume screening, mock interviews, "
            "technical preparation, and interview readiness "
            "to increase application-to-selection conversion."
        )

    # Rejected students

    if rejected_count > 0:

        recommendations.append(
            "Provide personalized feedback and mock interview "
            "sessions for students with rejected applications."
        )

    # Active drives

    active_drives = overview["active_drives"]

    if active_drives == 0:

        recommendations.append(
            "Increase employer outreach because there are "
            "currently no published or ongoing placement drives."
        )

    elif active_drives < 3:

        recommendations.append(
            "Increase the number of active placement drives "
            "to provide students with more opportunities."
        )

    else:

        recommendations.append(
            "Continue maintaining a healthy pipeline of "
            "active placement drives across departments."
        )

    # Company engagement

    if len(companies) > 0:

        recommendations.append(
            "Prioritize employer relationships with companies "
            "showing strong hiring outcomes and explore similar "
            "roles from additional companies."
        )

    else:

        recommendations.append(
            "Increase employer outreach to build a stronger "
            "company placement pipeline."
        )

    # Hiring trend

    if len(hiring_trends) >= 2:

        latest_trend = hiring_trends[-1]

        previous_trend = hiring_trends[-2]

        if (
            latest_trend["applications"]
            < previous_trend["applications"]
        ):

            recommendations.append(
                "Recent application activity is declining. "
                "Promote upcoming placement drives and improve "
                "student awareness of available opportunities."
            )

    # Remove accidental duplicates while preserving order

    placement_performance = list(
        dict.fromkeys(
            placement_performance
        )
    )

    attention_required = list(
        dict.fromkeys(
            attention_required
        )
    )

    recommendations = list(
        dict.fromkeys(
            recommendations
        )
    )

    return {
        "placement_performance":
            placement_performance,

        "attention_required":
            attention_required,

        "recommendations":
            recommendations,
    }