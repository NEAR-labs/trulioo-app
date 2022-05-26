import { Applicant } from "../../models/Applicant.js";
import { checkCode, invalidCode } from "../../helpers/codeUtils.js";
import { createUniqueId } from "../../helpers/createUniqueId.js";

export const createSession = async (req, res) => {
  try {
    const checkResult = await checkCode(req);
    if (!checkResult) {
      return invalidCode(res);
    }

    const sessionId = req.body["session_id"];
    const forced = req.body["forced"];
    const code = req.params.code;
    let applicant;

    if (sessionId) {
      applicant = await Applicant.findOne({session_id: sessionId});
      if (!applicant) {
        return res.status(400).send({ error: 'Session not found.' });
      }

      if (forced === "true") {
        applicant = await createApplicant(code, sessionId);
      } else {
        const lastSession = findLaterSession(code, sessionId);
        if (lastSession) {
          return res.status(400).send({ error: 'This session ID is no longer valid.' });
        }
      }

    } else {
      if (forced) {
        return res.status(400).send({ error: 'Session ID cannot be empty.' });
      }
      applicant = await createApplicant(code);
    }
    if (!applicant) {
      return res.status(400).send({ error: 'The session ID for this URL is already registered.' });
    }

    res.send({ session_id: applicant.session_id, status: applicant.status });

  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ error: 'Session not registered. Please try again later.' });
  }
}

async function createApplicant(code, oldSessionId = null) {
  const storedApplicant = findLaterSession(code, oldSessionId);
  if (storedApplicant) {
    return null;
  }
  const sessionId = createUniqueId();
  const applicant = new Applicant({
    session_id: sessionId,
    code: code,
    session_timestamp: new Date(),
    status: "new",
    old_session_id: oldSessionId
  });
  await applicant.save();
  return applicant;
}

async function findLaterSession(code, oldSessionId = null) {
  return Applicant.findOne({code: code, old_session_id: {$eq: oldSessionId}});
}