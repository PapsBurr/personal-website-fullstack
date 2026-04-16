from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest
from conftest import BASE_URL


@pytest.mark.smoke
def test_experience_page_initialization(driver):
    driver.get(f"{BASE_URL}experience")
    main = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "main"))
    )
    assert (
        main is not None
    ), "Main content area should be present on the experience page"


@pytest.mark.smoke
def test_experience_page_has_experience_section(driver):
    driver.get(f"{BASE_URL}/experience")
    experience_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Experience')]")
        )
    )
    assert (
        experience_section is not None
    ), "The experience page should have an Experience section since it's the main content of the page"


@pytest.mark.smoke
def test_experience_page_has_wordpress_section(driver):
    driver.get(f"{BASE_URL}/experience")
    wordpress_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'WordPress')]"))
    )
    assert (
        wordpress_section is not None
    ), "The experience page should have a WordPress section since it's the main content of the page"
