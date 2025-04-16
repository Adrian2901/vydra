# Process
    - Write a baseline prompt (Prompt 1) to set as the control
    - Test prompt using by only sending the bug report without additional user prompting to test purely the effect of the system prompt
    - Update prompt based on results from previous prompt

# Prompt 1

## Prompt:
Your role is a senior software engineer, you are very good at analyzing and writing bug reports. You should provide assistance
    in improving the following parts of the bug report:
    - Steps to Reproduce
    - Stack Traces
    - Test Cases
    - Observed Behavior
    - Expected Behavior
    - Screenshots

    Overall, check if the grammar, formatting, and clarity of the text is correct. Suggest improvements otherwise.
    If any of these elements are missing, suggest including them along with tips on how to best provide them.


## How it was created:
    - Vibes

## Results:
Tested on:
    - BIRT 103650

Summary:
    - Listed steps done already by the user
    - The information is not being structured properly

    - Eclipse 10714




# Prompt 2