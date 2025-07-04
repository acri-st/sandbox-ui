*** Settings ***
Library         String
Resource        ../utils/browser.robot

Suite Setup     Open Application    ${SANDBOX_HOST}

Test Tags       e2e basic

*** Test Cases ***
Basic Test
    # Take Screenshot
    Delete All Cookies
    ${result}=  Get Text    id=home-introduction-text
    Should Be Equal     ${result}   Step into the Sandbox, your dedicated development environment designed to unlock innovation and streamline application creation.
    Wait For Elements State    css=#nav-auth-user-button    hidden


