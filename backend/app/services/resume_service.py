from pathlib import Path

import pymupdf


class ResumeService:

    # ---------------------------------------------------------
    # CONFIGURATION
    # ---------------------------------------------------------

    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
    ALLOWED_MIME_TYPE = "application/pdf"

    STORAGE_DIR = Path("backend/storage/resumes")

    # ---------------------------------------------------------
    # PDF VALIDATION
    # ---------------------------------------------------------

    @staticmethod
    def validate_pdf(
        filename: str,
        content_type: str | None,
        file_size: int,
    ) -> None:
        """
        Validate uploaded resume before storing it.
        """

        if not filename:
            raise ValueError("Resume filename is required")

        if not filename.lower().endswith(".pdf"):
            raise ValueError("Only PDF resumes are allowed")

        if content_type != ResumeService.ALLOWED_MIME_TYPE:
            raise ValueError("Resume must be a PDF file")

        if file_size <= 0:
            raise ValueError("Resume file is empty")

        if file_size > ResumeService.MAX_FILE_SIZE:
            raise ValueError(
                "Resume file size must not exceed 5 MB"
            )

    # ---------------------------------------------------------
    # SAVE RESUME
    # ---------------------------------------------------------

    @staticmethod
    def save_file(
        file_bytes: bytes,
        filename: str,
        student_id: str,
        version: int,
    ) -> str:
        """
        Save the uploaded resume PDF to local storage.

        The original filename is not used as the storage filename
        to avoid collisions and unsafe filenames.
        """

        ResumeService.STORAGE_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        safe_filename = (
            f"{student_id}_v{version}.pdf"
        )

        file_path = (
            ResumeService.STORAGE_DIR
            / safe_filename
        )

        file_path.write_bytes(file_bytes)

        return str(file_path)

    # ---------------------------------------------------------
    # EXTRACT TEXT
    # ---------------------------------------------------------

    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract readable text from a PDF resume using PyMuPDF.

        This extracted text can later be passed to the
        AI Resume Analyzer for:
        - skill extraction
        - resume scoring
        - job-description matching
        - skill-gap analysis
        - experience analysis
        """

        path = Path(file_path)

        if not path.exists():
            raise ValueError("Resume file not found")

        if not path.is_file():
            raise ValueError("Resume path is not a file")

        if path.suffix.lower() != ".pdf":
            raise ValueError("Only PDF resumes are supported")

        document = None

        try:
            document = pymupdf.open(path)

            text_parts: list[str] = []

            for page in document:
                page_text = page.get_text("text")

                if page_text:
                    cleaned_page_text = page_text.strip()

                    if cleaned_page_text:
                        text_parts.append(
                            cleaned_page_text
                        )

            extracted_text = "\n\n".join(
                text_parts
            ).strip()

            if not extracted_text:
                raise ValueError(
                    "No readable text found in the resume"
                )

            return extracted_text

        except ValueError:
            raise

        except Exception as exc:
            raise ValueError(
                f"Unable to extract text from resume: {exc}"
            ) from exc

        finally:
            if document is not None:
                document.close()

    # ---------------------------------------------------------
    # EXTRACT TEXT FROM BYTES
    # ---------------------------------------------------------

    @staticmethod
    def extract_text_from_bytes(
        file_bytes: bytes,
    ) -> str:
        """
        Extract text directly from PDF bytes.

        Useful when the PDF has been uploaded but has not yet
        been permanently stored.
        """

        if not file_bytes:
            raise ValueError("Resume file is empty")

        document = None

        try:
            document = pymupdf.open(
                stream=file_bytes,
                filetype="pdf",
            )

            text_parts: list[str] = []

            for page in document:
                page_text = page.get_text("text")

                if page_text:
                    cleaned_page_text = page_text.strip()

                    if cleaned_page_text:
                        text_parts.append(
                            cleaned_page_text
                        )

            extracted_text = "\n\n".join(
                text_parts
            ).strip()

            if not extracted_text:
                raise ValueError(
                    "No readable text found in the resume"
                )

            return extracted_text

        except ValueError:
            raise

        except Exception as exc:
            raise ValueError(
                f"Unable to extract text from resume: {exc}"
            ) from exc

        finally:
            if document is not None:
                document.close()