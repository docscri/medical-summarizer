# Walk-in record brief: General Medicine pilot

## The problem

Some patients arrive at a Kerala clinic with a thick file of earlier prescriptions, reports, discharge summaries, and images. A General Medicine doctor has little time to find the parts relevant to today's visit. The proposed product turns captured records into a short, chronological, source-linked brief that the doctor can review during the consultation. The pilot opens on the timeline, following the [prototype selection decision](docs/adr/0001-timeline-first-general-medicine-pilot.md).

**Primary outcome:** save doctor review and documentation time on visits with substantial prior records. A brief that saves no doctor time does not meet this pilot's goal. The doctor must also check for clinically important omissions and errors.

## Walk-in workflow

1. At check-in, the patient states the reason for today's visit and gives permission for the clinic to capture and process their records. Staff provide a visit-specific upload link or QR code, with Malayalam and English instructions and no patient account required for the pilot. The intake process checks that every captured page belongs to the correct patient.
2. Patients who are comfortable using a phone photograph and upload paper pages. A nurse helps anyone who needs assistance, based on ability and bundle size. Occasional digital files can be uploaded directly. If time is short, a checklist agreed with the doctor determines which pages to capture first; the remaining paper bundle is marked uncaptured. The clinic must confirm that this can happen during normal waiting time without disrupting nursing work.
3. The system groups pages into documents, reads English text, extracts document dates and key facts, and builds a timeline. An uncertain date, unreadable page, or unprocessed document is shown as such. If the patient is called early, the doctor can open a clearly marked partial brief.
4. The doctor opens a timeline of prior record events focused on today's reason for visit, with a short overview and the original page behind every finding. The brief distinguishes **document-stated**, **patient-reported**, and **doctor-reviewed** information. Patients see upload status and can report medication status; the AI-generated clinical brief is doctor-facing during the pilot.
5. The patient may mark an old prescription as **taking now**, **stopped**, or **unsure**. Unclear handwritten medicine names and doses remain in **Needs review** with the original image visible. The doctor confirms medication and other relevant facts before adding selected items to today's [General Medicine note](../clinical-notes/schemas/01-general-medicine.schema.json).
6. New pages produce a visibly updated brief. The doctor chooses whether to review changes, and today's note changes only after doctor approval. After the visit, uploaded source records and dated doctor-reviewed corrections can support future visits, subject to the clinic's agreed patient notice, access, and retention process. Each new visit gets a brief focused on its own reason for consultation.

The first version displays X-ray images and summarizes accompanying **written radiology reports**. It does not interpret the image itself, make diagnoses, or create new urgent alerts from raw values. It may reproduce abnormal flags already printed on a report.

## First clinic conversation

Ask the General Medicine doctor to walk through a recent visit involving many prior pages. Establish:

- How often this happens, how many pages are typical, and which documents the doctor looks at first.
- Minutes spent finding, reading, and documenting prior information today; where important facts are missed or duplicated.
- How long patients wait before consultation, and whether patient or nurse page capture fits that window.
- What the doctor would need to see in a trustworthy 30-second brief and what must always link back to a source page.
- Whether the doctor and clinic would review a small, permissioned prototype using suitable sample records.

Use the [clinic discovery and observation guide](clinic-discovery-and-pilot-observation.md) to capture the current process, including which record software the clinic actually uses.

The clinic is a **potential** pilot partner; its participation and current intake capacity have not yet been confirmed.

## Pilot test and decision

Start with General Medicine visits that have substantial prior records; define the eligibility threshold with the doctor after observing real cases. Use synthetic or suitably de-identified records for early prototypes until the clinic agrees to participate and the real-data arrangement is settled. Observe the current process before setting a time-saving target. In the pilot, compare doctor review/documentation time with the baseline and also record patient and nurse capture time, how often a brief is ready before consultation, and clinician-rated important omissions, wrong facts, and corrections. Agree on a minimum worthwhile doctor-time saving and an acceptable error standard with the doctor **before** judging the pilot. A large shift of work to nurses requires intake redesign. Expand to other departments only after this workflow works in the clinic.

The initial business hypothesis is that the clinic pays for the service and patients pay no upload fee. Test that hypothesis after the workflow proves useful.

## EHR and public-record integration path

The paper-record pilot can run alongside the clinic's current software. First identify its actual EHR or clinic-management product and confirm whether the vendor supports patient/visit lookup and a doctor-approved note export or import. A supported interface can then reduce duplicate entry.

**ABHA** is the national identifier used to link records across participating ABDM systems with consent; it is not an automatic archive of every record a patient has. **eHealth Kerala UHID** belongs to Kerala's state system, whose public portal describes services at eHealth-enabled government hospitals. Direct access to that system from the prospective private clinic has not been verified. [Kerala ABDM explanation](https://ehealth.kerala.gov.in/abdm), [Kerala eHealth portal](https://ehealth.kerala.gov.in/)

After the paper workflow proves useful, investigate two optional ABDM connections: receive available prior records with patient consent as a Health Information User, and publish approved clinic records as a Health Information Provider. These require actual clinic/vendor participation and ABDM onboarding. Map any approved exported record to the applicable [ABDM FHIR profile](https://nrces.in/ndhm/fhir/r4/); the existing note JSON schemas are not assumed to be FHIR compliant. The [integration research note](ehr-abdm-kerala-research.md) records official sources, possible routes, and questions for the clinic and vendors.

## Data handling to settle before using real records

The clinic and product team need a clear patient notice and permission flow, staff access rules, secure handling of captured pages, a retention/deletion policy, and a way to correct records. Confirm applicable Indian requirements before a live pilot. India's [Digital Personal Data Protection Act](https://www.meity.gov.in/static/uploads/2024/02/Digital-Personal-Data-Protection-Act-2023.pdf) and the [ABDM Health Data Management Policy](https://abdm.gov.in/static/media/health_management_policy_bac9429a79.80f74bc3e039c00acd4f.pdf) are primary references; ABDM-specific requirements depend on whether the product joins that ecosystem. The [WHO guidance on AI in health](https://www.who.int/news/item/18-01-2024-who-releases-ai-ethics-and-governance-guidance-for-large-multi-modal-models) explains why source access and clinician review matter for AI-generated summaries.
