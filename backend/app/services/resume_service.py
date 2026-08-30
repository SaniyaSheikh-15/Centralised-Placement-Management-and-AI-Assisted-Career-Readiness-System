from pathlib import Path

import pymupdf


class ResumeService:

    MAX_FILE_SIZE = 5 * 1024 * 1024
    ALLOWED_MIME_TYPE = "application/pdf"

    STORAGE_DIR = Path("backend/storage/resumes")

    @staticmethod
    def validate_pdf(
        filename: str,
        content_type: str | None,
        file_size: int,
    ) -> None:

        if not filename.lower().endswith(".pdf"):
            raise ValueError("Only PDF resumes are allowed")

        if content_type != ResumeService.ALLOWED_MIME_TYPE:
            raise ValueError("Resume must be a PDF file")

        if file_size > ResumeService.MAX_FILE_SIZE:
            raise ValueError("Resume file size must not exceed 5 MB")

    @staticmethod
    def save_file(
        file_bytes: bytes,
        filename: str,
        student_id: str,
        version: int,
    ) -> str:

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

    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from a PDF resume using PyMuPDF.
        """

        path = Path(file_path)

        if not path.exists():
            raise ValueError("Resume file not found")

        if path.suffix.lower() != ".pdf":
            raise ValueError("Only PDF resumes are supported")

        try:
            document = pymupdf.open(path)

            text_parts = []

            for page in document:
                text = page.get_text()

                if text:
                    text_parts.append(text)

            document.close()

            extracted_text = "\n".join(
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
            )