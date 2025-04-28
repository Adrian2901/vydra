# Process
    - Write a baseline prompt (Prompt 1) to set as the control
    - Test prompt using by only sending the bug report without additional user prompting to test purely the effect of the system prompt
    - Update prompt based on results from previous prompt

# Bug reports chosen
AspectJ 45489
AspectJ 164288
BIRT 104630
Eclipse 10714

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


AspectJ 45489
AspectJ 164288
BIRT 104630
BIRT 126953
Eclipse 5667
Eclipse 10714
JDT 6233
JDT 9159
SWT 18629
SWT 38987
Tomcat 43236
Tomcat 50059

## Results:

Overall:
    - a lot of summarization and using the users' own reasoning as suggestions to them
    - gives a lot of suggestions how to solve the bug, especially when code snippets are given
    - asks about adding missing elements to the bug report



# Prompt 2

## Prompt:
Check if the following parts exist in the bug report:
    - Steps to Reproduce
    - Stack Traces
    - Test Cases
    - Observed Behavior
    - Expected Behavior
    - Screenshots

If they do not exist, tell the user they need to provide them. Check if the grammar and formatting of the text is correct.
If it is not correct, tell the user to fix it and how to fix it.
Do not summarize the bug report.

- no persona, explicitly say to check that parts of bug report exist

AspectJ 45489
AspectJ 164288
BIRT 104630
BIRT 126953
Eclipse 5667
Eclipse 10714
JDT 6233
JDT 9159
SWT 18629
SWT 38987
Tomcat 43236
Tomcat 50059

Overall summary:
    - still summarizes
    - offered fixes and ignored everything else
    - sometimes organizes steps to reproduce
    - without the persona, the LLM hallucinates a lot more


# Prompt 3

## Prompt:
Your role is a senior software engineer, you are very good at analyzing and writing bug reports. Check if the following parts exist in the bug report:
    - Steps to Reproduce
    - Stack Traces
    - Test Cases
    - Observed Behavior
    - Expected Behavior
    - Screenshots

If they do not exist, tell the user they need to provide them. Check if the grammar and formatting of the text is correct.
If it is not correct, tell the user to fix it and how to fix it.
Do not summarize the bug report and do not offer solutions to fixing the bug.


- add persona back and add that it shouldnt try to fix the bug


AspectJ 45489
AspectJ 164288
BIRT 104630
BIRT 126953
Eclipse 5667
Eclipse 10714
JDT 6233
JDT 9159
SWT 18629
SWT 38987
Tomcat 43236
Tomcat 50059

Overall summary: 
    - seems to be more of a conversation starter most of the time rather than just a summary


# Prompt 4

## Prompt:
Your role is a senior software engineer, you are very good at analyzing and writing bug reports. Check if the following parts exist in the bug report:
    - Steps to Reproduce: how the bug was found and the actions needed to recreate that process,
    - Stack Traces: report of the stack frames at the time of the bug,
    - Test Cases: methods to test the component where the bug is occuring,
    - Observed Behavior: what the user sees when the bug is happening (in text or images),
    - Expected Behavior: what the application should be doing

If they do not exist, tell the user they need to provide them. Check if the grammar and formatting of the text is correct.
If it is not correct, tell the user to fix it and how to fix it.
Do not summarize the bug report and do not offer solutions to fixing the bug.


- add definitions for the elements of the bug report. moved screenshots from their own category to OB


AspectJ 45489
AspectJ 164288
BIRT 104630
BIRT 126953
Eclipse 5667
Eclipse 10714
JDT 6233
JDT 9159
SWT 18629
SWT 38987
Tomcat 43236
Tomcat 50059

Overall:
    - best results when adding an additional message from the user to start the conversationS