from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest
from conftest import BASE_URL


@pytest.mark.smoke
def test_android_page_initialization(driver):
    driver.get(f"{BASE_URL}/android")
    main = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "main"))
    )
    assert main is not None, "Main content area should be present on the Android page"


@pytest.mark.smoke
def test_android_page_has_android_section(driver):
    driver.get(f"{BASE_URL}/android")
    android_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Android apps')]")
        )
    )
    assert (
        android_section is not None
    ), "The Android page should have an Android Apps section since it's the main content of the page"


@pytest.mark.smoke
def test_android_page_has_vacation_planner_app_section(driver):
    driver.get(f"{BASE_URL}/android")
    vacation_planner_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Vacation Planner App')]")
        )
    )
    assert (
        vacation_planner_section is not None
    ), "The Android page should have a Vacation Planner App section since it's one of the key projects featured on the page"


@pytest.mark.smoke
def test_android_page_has_lights_out_game_section(driver):
    driver.get(f"{BASE_URL}/android")
    lights_out_game_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Lights out')]")
        )
    )
    assert (
        lights_out_game_section is not None
    ), "The Android page should have a Lights Out Game section since it's one of the key projects featured on the page"


@pytest.mark.smoke
def test_android_page_has_timer_app_section(driver):
    driver.get(f"{BASE_URL}/android")
    timer_app_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Timer app')]"))
    )
    assert (
        timer_app_section is not None
    ), "The Android page should have a Timer App section since it's one of the key projects featured on the page"


@pytest.mark.smoke
def test_android_page_has_github_button(driver):
    driver.get(f"{BASE_URL}/android")
    github_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//a[contains(@href, 'github.com/nathanpons')]")
        )
    )
    assert (
        github_button is not None
    ), "The Android page should have a GitHub button linking to my profile since it's important for visitors to see my code repositories"
