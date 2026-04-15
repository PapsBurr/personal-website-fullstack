from selenium.webdriver.common.by import By
import pytest
from frontend.e2e_tests.conftest import BASE_URL


@pytest.mark.smoke
def test_header_initialization(driver):
    driver.get(BASE_URL)
    header = driver.find_element(By.TAG_NAME, "header")
    assert header is not None, "Header element should be present on the page"
    assert header.is_displayed(), "Header should be visible on the page"
    assert header.text != "", "Header should contain text content"
