from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from conftest import BASE_URL


def test_homepage_initialization(driver):
    driver.get(BASE_URL)
    main = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "main"))
    )
    assert main is not None, "Main content area should be present on the homepage"


def test_homepage_has_name(driver):
    driver.get(BASE_URL)
    name = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//h1[contains(text(), 'Nathan Pons')]")
        )
    )
    assert (
        name is not None
    ), "The homepage should contain my name since it's my portfolio"


def test_homepage_has_title(driver):
    driver.get(BASE_URL)
    title = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Software Engineer')]")
        )
    )
    assert (
        title is not None
    ), "The homepage should have my profession title element in the head section"


def test_homepage_has_apod(driver):
    driver.get(BASE_URL)
    apod = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'APOD')]"))
    )
    assert (
        apod is not None
    ), "The homepage should have the APOD section since it's a key feature of the site"


def test_homepage_has_capabilities(driver):
    driver.get(BASE_URL)
    capabilities = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Capabilities')]")
        )
    )
    assert (
        capabilities is not None
    ), "The homepage should have the Capabilities section since it's a key feature of the site"


def test_homepage_has_programming_languages(driver):
    driver.get(BASE_URL)
    programming_languages = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Programming Languages')]")
        )
    )
    assert (
        programming_languages is not None
    ), "The homepage should have the Programming Languages section since it's a key feature of the site"
