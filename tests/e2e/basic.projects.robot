*** Settings ***
Library         String
Resource        ../utils/browser.robot

Suite Setup     Open Application    ${SANDBOX_HOST}/projects

Test Tags       e2e basic projects

*** Test Cases ***
Basic Test Project page
    # Take Screenshot
    ${result}=  Get Text    css=.login-required p
    ${result}=  Convert To Lowercase    ${result}
    Should Be Equal     ${result}   you must be signed in to access this section.

