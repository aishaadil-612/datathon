# Directive: AI FIR Assistant Workflow

## Overview
The AI FIR Assistant helps citizens and police officers submit, process, extract, structure, and verify First Information Reports (FIRs) under human-in-the-loop police officer oversight.

## Key Functions & Tools
1. **Complaint Intake & Entity Extraction** (`agents/fir_assistant/tools/complaint_intake.py`):
   - Accepts complaint text or voice transcript.
   - Extracts structured key details: Complainant Info, Incident Date & Time, Location/GPS, Crime Description, Suspect Info, Stolen Assets/Evidence, Witnesses.
   - Highlights missing fields and generates follow-up questions.

2. **FIR Drafter & Crime Categorizer** (`agents/fir_assistant/tools/fir_drafter.py`):
   - Automatically categorizes crime type (Cyber Crime, Theft, Assault, Extortion, Women Safety, Missing Persons, etc.).
   - Maps to applicable legal sections (BNS / IPC).
   - Determines Cognizable vs. Non-Cognizable offence status.
   - Formats a structured draft FIR with status `PENDING_POLICE_APPROVAL`.

3. **Authenticity & AI Fraud Verifier** (`agents/fir_assistant/tools/authenticity_verifier.py`):
   - Performs identity status validation (OTP / DigiLocker / Aadhaar verification).
   - Validates digital evidence metadata & GPS location timestamps.
   - Searches historical FIR database for duplicate or suspicious complaints.
   - Assigns AI Fraud Risk Score: `LOW` (0.0–0.35), `MEDIUM` (0.36–0.70), `HIGH` (0.71–1.00).

4. **Officer Action Recommender** (`agents/fir_assistant/tools/officer_action_recommender.py`):
   - Recommends police officer actions based on legal classification and risk score.
   - Routes case to specialized units (Cyber Crime Cell, Women Protection Cell, Traffic Police, Special Task Force).
   - Flag preliminary inquiry requirements where mandatory.
   - Recommends digital evidence preservation and emergency escalation triggers.

## Governance & Human-in-the-Loop Constraint
- All FIR drafts created by the AI FIR Assistant MUST remain in `PENDING_POLICE_APPROVAL` status until explicitly reviewed, verified, and approved by a verified police officer (`REGISTERED`).
