# Record Brief: timeline-first clinic pilot

The doctors consulted by the user preferred **Prototype 2, timeline first**, because chronological records were easier for them to follow. This fictional, in-memory pilot now opens on that layout. A General Medicine doctor can select a dated event, inspect its original page, review a finding, and deliberately select it for today's **draft** note. The brief and split-screen variants remain in the UI study for comparison. The feedback is a preference report; task timing and error rates have not been supplied.

Run from the workspace root:

```powershell
python documentation_feature/prototype-record-brief/serve.py
```

Open <http://127.0.0.1:8765/?variant=timeline>. The **Choose a visit situation** buttons load independent workflow demos. The URL also accepts `?variant=timeline&scenario=early` (or `happy`, `trust`, `disagree`, `no-permission`, `wrong-patient`, `next`). Each switch resets the in-memory demo state. On desktop, the selected event's details appear beside the chronology. On tablet, they appear immediately below the selected event. The floating layout bar still permits comparison with the other variants.

## Scenarios to test with the doctor

| Situation | Try this | Expected result |
| --- | --- | --- |
| Normal visit | Select the older prescription in the timeline, open its source, ask about current metformin use, review, then add selected facts to the note | Nothing enters the draft note automatically |
| Called in early | Scan the partial timeline, try the pending handwritten prescription, then choose **Finish processing** | Only ready sources appear first; newly processed events require fresh review |
| Trust gate | Try **To note** on metformin immediately; then open the source, choose Taking/Stopped/Unsure, review, and retry | Each missing step blocks note import and explains what is needed |
| Patient correction | Choose **Patient now says stopped** after the preloaded reviewed “taking” answer | The old answer remains in the dated trail; its draft-note item is removed; doctor review is required again |
| No permission | Try opening a record, then simulate patient permission | Record content remains hidden until permission is simulated |
| Wrong patient | Inspect the access pause, then simulate a staff identity check | The mismatched page remains quarantined and excluded from sources |
| Next visit | Simulate permission for visit 2 and inspect the dated trail | Prior documents and dated review context are visible; today's medicine-use answer, source checks, reviews, and note selections are empty |

The typed prescription shows what was prescribed in November 2025. **Taking**, **Stopped**, and **Unsure** are patient-reported answers for the current visit; doctor review records that the doctor checked the source and answer, not that adherence was independently proven. This separation follows the medication reconciliation concern that prescribed medicines can differ from what a patient actually takes ([WHO](https://iris.who.int/bitstream/handle/10665/325453/WHO-UHC-SDS-2019.9-eng.pdf), [AHRQ](https://www.ahrq.gov/health-literacy/improve/precautions/tool8.html)). The handwritten medicine cannot receive a current-use answer until its name is established; its unreadable name and dose stay uncertain here.

**Prototype assumptions to validate at the clinic:** permission is requested per visit; previously supplied documents and a dated correction trail may remain available under clinic policy; current-use answers and draft-note decisions reset for each visit. The buttons only simulate permission and identity resolution. There is no real consent capture, identity service, EHR integration, persistence, diagnostic interpretation, or signed-note workflow. In a production EHR, a patient correction after a note is signed needs the EHR's amendment process; this prototype only removes an item from an unsigned draft.

Run the workflow checks with:

```powershell
node documentation_feature/prototype-record-brief/workflow.test.js
```

The **Prototype state** control exposes the in-memory transitions. During the next clinician review, check whether the doctor can find a dated event quickly, see that undated records appear last, recognize pending pages, trace each claim to a source page, distinguish a past prescription from current use, and understand why an item is blocked from the note. Record time and mistakes as well as preference before deciding on production behavior.
