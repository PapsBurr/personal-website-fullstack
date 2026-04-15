from selenium.webdriver.common.by import By
from conftest import BASE_URL


def test_header_initialization(self, driver):
    driver.get(BASE_URL)
    header = driver.find_element(By.TAG_NAME, "header")
    assert header is not None, "Header element should be present on the page"
    assert header.is_displayed(), "Header should be visible on the page"
    assert header.text != "", "Header should contain text content"
