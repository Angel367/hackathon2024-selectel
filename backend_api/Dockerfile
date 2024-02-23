# Use an official Python runtime as a parent image
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /code/
COPY backend_api /code/
COPY backend_api/manage.py /code/

# Run makemigrations
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "makemigrations"]
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "makemigrations", "backend_api_app"]
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "makemigrations"]
CMD ["python", "manage.py", "migrate"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
