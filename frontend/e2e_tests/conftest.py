import pytest
from selenium import webdriver
import os

BASE_URL = os.environ.get("BASE_URL", "https://nathanpons.com/")


@pytest.fixture(scope="session")
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    service = webdriver.ChromeService()
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()
