from pathlib import Path


class ProfilePhotoService:

    MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 MB

    ALLOWED_MIME_TYPES = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    STORAGE_DIR = Path("backend/storage/profile_photos")

    @staticmethod
    def validate_image(
        filename: str,
        content_type: str | None,
        file_size: int,
    ) -> None:

        if not filename:
            raise ValueError("Profile photo filename is required")

        if content_type not in ProfilePhotoService.ALLOWED_MIME_TYPES:
            raise ValueError(
                "Only JPG, PNG, and WEBP profile photos are allowed"
            )

        if file_size > ProfilePhotoService.MAX_FILE_SIZE:
            raise ValueError(
                "Profile photo size must not exceed 2 MB"
            )

    @staticmethod
    def save_file(
        file_bytes: bytes,
        student_id: str,
        content_type: str,
    ) -> str:

        ProfilePhotoService.STORAGE_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        extension_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
        }

        extension = extension_map[content_type]

        safe_filename = f"{student_id}{extension}"

        file_path = (
            ProfilePhotoService.STORAGE_DIR
            / safe_filename
        )

        file_path.write_bytes(file_bytes)

        return str(file_path)