TruthLens AI — Documentation
A lightweight web app for spotting potential bias and misinformation in short text, powered by Hugging Face inference APIs.

Table of Contents
Project Overview
1.1 Introduction
1.2 Core Features
1.3 Target Users

Technical Architecture
2.1 Technology Stack
2.2 Key Components
2.3 External Dependencies

Development Approach
3.1 Initial Planning
3.2 Key Decisions

Implementation Details
4.1 App Structure
4.2 State & Error Handling
4.3 Result Processing

User Interface Design
5.1 Design Principles
5.2 Screen Layout

API Integration
6.1 Models & Labels
6.2 Request/Response Shape
6.3 Performance & Rate Limits

Future Improvements

Security & Privacy Considerations

1. Project Overview
1.1 Introduction
TruthLens AI helps users quickly assess text for bias and potential misinformation. It uses zero-shot classification via Hugging Face models to analyze user-submitted text and returns interpretable labels with confidence scores in real time.

1.2 Core Features
Clean text input for user submissions

Bias and misinformation cues via zero-shot classification

Real-time analysis with loading and error feedback

Clear result panels with confidence scores

Simple, responsive UX suitable for desktop and mobile

1.3 Target Users
Researchers and students

Journalists and editors

Content creators and moderators

Anyone verifying headlines, posts, or short claims

2. Technical Architecture
2.1 Technology Stack
Frontend: React + TypeScript

UI: Material UI (MUI)

HTTP: Axios

AI Services: Hugging Face Inference API

State: React Hooks (useState, optionally useEffect)

2.2 Key Components
App.tsx (SPA shell):
Centralized state, API calls, result orchestration.

UI Elements:

TextArea input

“Analyze” button

Results panels (Bias / Fact-check cues)

Confidence bars

Loading spinners & inline error messages

2.3 External Dependencies
@mui/material for layout, inputs, and theming

axios for API communication

Hugging Face zero-shot (e.g., facebook/bart-large-mnli) for classification

3. Development Approach
3.1 Initial Planning
Requirements: simple UI, fast feedback, clear labels, robust error handling.

Tech choices: React (component model), TypeScript (type safety), MUI (accessibility & speed), Hugging Face API (ready-to-use NLP).

3.2 Key Decisions
Model: facebook/bart-large-mnli for strong zero-shot performance, flexible label sets, and good speed/accuracy tradeoff.

SPA: single–page app for a focused flow and instant updates without routing complexity.

4. Implementation Details
4.1 App Structure
App.tsx manages: input text, loading state, error state, results.

Components:

Header (title & description)

InputPanel (multiline input + analyze button)

ResultsPanel (bias, fact-check cues, confidence)

Feedback (loading & errors)

4.2 State & Error Handling
Loading: disables actions, shows spinner.

Errors: network/API errors surface inline with actionable messaging.

Validation: basic (non-empty text) before firing a request.

4.3 Result Processing
Normalize model outputs into a consistent structure: {label, confidence}.

Map labels to UI sections (Bias / Fact-check) and visualize confidence with bars or chips.

Show helpful notes (e.g., “Model confidence is indicative, not proof.”).

5. User Interface Design
5.1 Design Principles
Simplicity — uncluttered layout, single CTA, obvious flow.

Feedback — visible loading, clear errors, success states, confidence visualization.

Accessibility — readable typography, sufficient contrast, responsive layout, ARIA labels.

5.2 Screen Layout
Header

App title + brief description.

Input

Multiline text field

Analyze button

Loading indicator

Results

Bias Detection:

Biased / Hate speech / Neutral / Respectful (as configured)

Fact-Checking Cues:

Factual / Opinion / Misleading / Needs Verification

Confidence scores and short notes

6. API Integration
6.1 Models & Labels
Model: facebook/bart-large-mnli (zero-shot).

Candidate labels: configured for two panels:

Bias panel: e.g., Biased language, Hate speech, Neutral language, Respectful language

Fact-check panel: e.g., Factual, Opinion, Misleading, Needs verification

(Labels are configurable without code changes to the model.)

6.2 Request/Response Shape
Request: { inputs: <userText>, parameters: { candidate_labels: [...], multi_label: true } }

Response: ranked labels with scores; convert to { label, confidence }[] for display.

6.3 Performance & Rate Limits
Debounce rapid submissions; disable button while in flight.

Surface rate-limit errors with a friendly retry suggestion.

Keep payloads small; trim whitespace; avoid repeated calls for identical text.

7. Future Improvements
Custom label sets per domain (health, politics, finance).

Explanations (salient phrases) to increase transparency.

Caching recent analyses client-side.

Internationalization (i18n) and RTL support.

Optional backend proxy for API keys and advanced heuristics.

8. Security & Privacy Considerations
Do not expose API keys in the client. Use a server proxy if keys are required.

Transmit data over HTTPS only.

Avoid storing user text; if logging is needed, redact PII and keep minimal retention.

Handle 3rd-party API failures gracefully without leaking internals.
