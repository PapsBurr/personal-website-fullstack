import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from conftest import BASE_URL


@pytest.mark.parametrize(
    "link_text",
    [
        "Home",
        "Experience",
        "Websites",
        "DevOps",
        "Android",
        "Projects",
        "GitHub",
    ],
)
def test_header_navigation_links_exist(self, driver, link_text):
    driver.get(BASE_URL)
    header = driver.find_element(By.TAG_NAME, "header")
    nav_links = header.find_elements(By.TAG_NAME, "a")
    assert len(nav_links) > 0, "Header should contain navigation links"

    matching_link = next((link for link in nav_links if link.text == link_text), None)
    assert (
        matching_link is not None
    ), f"Navigation link '{link_text}' not found in header"

    href = matching_link.get_attribute("href")
    assert (
        href is not None and href != ""
    ), f"Navigation link '{link_text}' should have a valid href attribute"


def test_header_navigation_links_functionality(self, driver):
    driver.get(BASE_URL)

    header = driver.find_element(By.TAG_NAME, "header")
    nav_links = header.find_elements(By.TAG_NAME, "a")
    link_hrefs = [link.get_attribute("href") for link in nav_links]

    for href in link_hrefs:
        driver.get(BASE_URL)  # Reset to homepage before each click
        header = driver.find_element(By.TAG_NAME, "header")
        nav_links = header.find_elements(By.TAG_NAME, "a")

        link = next(
            (link for link in nav_links if link.get_attribute("href") == href),
            None,
        )
        assert link is not None, f"Link with href '{href}' should be found in header"

        original_window = driver.current_window_handle
        link.click()

        # Check if a new tab was opened
        if len(driver.window_handles) > 1:
            # Switch to new tab and verify URL
            new_window = next(
                window for window in driver.window_handles if window != original_window
            )
            driver.switch_to.window(new_window)
            WebDriverWait(driver, 10).until(
                EC.url_contains(href)
            ), f"New tab should contain {href}"
            driver.close()  # Close the new tab
            driver.switch_to.window(original_window)  # Switch back to original tab
        else:
            WebDriverWait(driver, 10).until(
                EC.url_to_be(href)
            ), f"Clicking '{href}' should navigate to {href}"
