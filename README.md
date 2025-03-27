# What makes a good quality bug report?

## *What makes a good bug report?* (Bettenburg et al.)
- https://dl.acm.org/doi/pdf/10.1145/1453101.1453146

- surveyed both developers and bug reporters from Apache, Eclipse, Mozilla repositories
- developers
    - **most used parts of a bug reports**
        - steps to reproduce
        - observed and expected behavior
        - stack traces
        - test cases
    - **rarely used**
        - hardware
        - severity
    - **rated as most important (in descending order)**
        - steps to reproduce (83%)
        - stack traces (57%)
        - test cases (51%)
        - observed behavior (33%)
        - screenshots (26%)
        - expected behavior (22%)
        - code examples (14%)
        - summary (13%)
        - error reports (12%)
        - version (12%)
        - build information (8%)
        - product (5%)
        - operating system (4%)
        - component (3%)
        - hardware (0%)
        - severity (0%)
    - **top 10 problems encountered in bug reports (no particular order)**
        - incomplete information
        - steps to reproduce
        - duplicates
        - bad grammar
        - unstructured text
        - expected behavior
        - version number
        - observed behavior
        - component name
        - too long text
    - **additional comments**
        - different knowledge levels between bug reporters
        - rude/sarcastic bug reports are less likely to be solved
        - complicated steps to reproduce

- reporters
    - **most commonly given**
        - steps to reproduce
        - observed behavior
        - expected behvior
        - "mandatory fields" (product, component, version, operating system, summary)
    - **most difficult to give**
        - test cases (75%)
        - steps to reproduce (51%)
        - code examples (43%)
        - stack traces (24%)
        - component (22%)
        - screenshots (8%)
        - rest are under 5%
    - **what they think is most relevant to a developer**
        - steps to reproduce (78%)
        - test cases (43%)
        - observed behavior (33%)
        - stack traces (33%)
        - expected behavior (22%)
        - version (12%)
        - code examples (9%)
        - error reports (9%)
        - build info (8%)
        - product (7%)
        - summary (6%)
        - screenshots (5%)
        - component (4%)
        - operating system (4%)
        - severity (2%)
        - hardware (0%)


## *Modeling Bug Report Quality* (Hooimeijer and Weimer)
- https://dl.acm.org/doi/abs/10.1145/1321631.1321639

- having attachments from the beginning lead to a longer solving time
- i didn't really understand all the statistics of this :(

## *“Not My Bug!” and Other Reasons for Software Bug Report Reassignments* (Guo et al.)
- https://dl.acm.org/doi/abs/10.1145/1958824.1958887

- causes of bug reassignments
    - finding the root cause is more important than solving the superficial consequences of a bug
    - determining what internal team should solve the bug as its related to the root cause. the root cause could be related to an entirely
        different part of the code than the symptom described in the bug report
    - 

# What can Vydra potentially help with?

# System prompt(s)

# References