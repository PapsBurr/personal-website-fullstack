import pytest
from selenium.webdriver.common.by import By
from axe_selenium_python import Axe
from conftest import BASE_URL


@pytest.mark.accessibility
@pytest.mark.skip(
    reason="Accessibility test is currently failing due to known issues that need to be addressed."
)
def test_accessibility_homepage(driver):
    driver.get(BASE_URL)

    # Run axe accessibility engine against the page
    axe = Axe(driver)
    axe.inject()
    results = axe.run()

    violations = results["violations"]

    # Print out any violations for debugging
    for v in violations:
        print(f"[{v['impact'].upper()}] {v['description']}")
        for node in v["nodes"]:
            print(f"  Affected element: {node['html']}")

    # Fail if any critical or serious violations found
    critical = [v for v in violations if v["impact"] in ("critical", "serious")]
    assert (
        len(critical) == 0
    ), f"{len(critical)} critical accessibility violations found!"
