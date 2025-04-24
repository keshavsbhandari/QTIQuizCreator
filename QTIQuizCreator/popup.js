document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });

  const convertBtn = document.getElementById('convertBtn');
  const quizNameInput = document.getElementById('quizName');
  const quizTitleInput = document.getElementById('quizTitle');
  const quizDescriptionInput = document.getElementById('quizDescription');
  const numQuestionsInput = document.getElementById('numQuestions');
  const numOptionsInput = document.getElementById('numOptions');
  const jsonContentInput = document.getElementById('jsonContent');
  const errorDiv = document.getElementById('error');
  const collapsible = document.querySelector('.collapsible');
  const content = document.querySelector('.content');
  const copyPromptBtn = document.getElementById('copyPrompt');
  const promptText = document.getElementById('promptText');
  const resetButton = document.getElementById('resetButton');
  const expandButton = document.getElementById('expandButton');
  const body = document.body;

  const inputsTextarea = document.getElementById('inputs');
  const scopeTextarea = document.getElementById('scope');
  const guidelinesTextarea = document.getElementById('guidelines');

  // Set default values for the sections
  const defaultInputs = `- The uploaded files.
- The quiz should assess foundational understanding of data structures as introduced in this document.`;

  const defaultScope = `- Create a comprehensive quiz that tests understanding of the subject matter
- Ensure questions cover different aspects of the topic
- Maintain consistent difficulty level throughout
- Include a mix of conceptual and application-based questions`;

  const defaultGuidelines = `- Each question should be clear and unambiguous
- Questions should progress from basic to more complex concepts
- Avoid trick questions or overly complex wording
- Ensure all options are plausible and well-distributed
- Include detailed feedback for each option
- Maintain academic rigor while being accessible`;

  // Load saved data
  function loadSavedData() {
    const savedData = localStorage.getItem('quizData');
    if (savedData) {
      const data = JSON.parse(savedData);
      quizTitleInput.value = data.quizTitle || '';
      quizDescriptionInput.value = data.quizDescription || '';
      numQuestionsInput.value = data.numQuestions || '8';
      numOptionsInput.value = data.numOptions || '4';
      quizNameInput.value = data.quizName || '';
      jsonContentInput.value = data.jsonContent || '';
      inputsTextarea.value = data.inputs || defaultInputs;
      scopeTextarea.value = data.scope || defaultScope;
      guidelinesTextarea.value = data.guidelines || defaultGuidelines;
      updatePrompt();
    } else {
      // Set default values if no saved data
      inputsTextarea.value = defaultInputs;
      scopeTextarea.value = defaultScope;
      guidelinesTextarea.value = defaultGuidelines;
    }
  }

  // Save data
  function saveData() {
    const data = {
      quizTitle: quizTitleInput.value,
      quizDescription: quizDescriptionInput.value,
      numQuestions: numQuestionsInput.value,
      numOptions: numOptionsInput.value,
      quizName: quizNameInput.value,
      jsonContent: jsonContentInput.value,
      inputs: inputsTextarea.value,
      scope: scopeTextarea.value,
      guidelines: guidelinesTextarea.value
    };
    localStorage.setItem('quizData', JSON.stringify(data));
  }

  // Load and display the prompt template
  function loadDefaultPrompt() {
    fetch(chrome.runtime.getURL('prompt.txt'))
      .then(response => response.text())
      .then(text => {
        promptText.innerHTML = text;
        highlightJSON();
      })
      .catch(error => {
        console.error('Error loading prompt template:', error);
      });
  }

  // Highlight JSON sections
  function highlightJSON() {
    const jsonSections = promptText.querySelectorAll('pre code');
    jsonSections.forEach(section => {
      hljs.highlightElement(section);
    });
  }

  // Reset all fields
  function resetFields() {
    quizTitleInput.value = '';
    quizDescriptionInput.value = '';
    numQuestionsInput.value = '8';
    numOptionsInput.value = '4';
    quizNameInput.value = '';
    jsonContentInput.value = '';
    inputsTextarea.value = defaultInputs;
    scopeTextarea.value = defaultScope;
    guidelinesTextarea.value = defaultGuidelines;
    updatePrompt();
    localStorage.removeItem('quizData');
  }

  // Update prompt based on input values
  function updatePrompt() {
    const title = quizTitleInput.value || 'Your Quiz Title';
    const description = quizDescriptionInput.value || 'Your Quiz Description';
    const numQuestions = numQuestionsInput.value || '8';
    const numOptions = numOptionsInput.value || '4';
    const inputs = inputsTextarea.value || defaultInputs;
    const scope = scopeTextarea.value || defaultScope;
    const guidelines = guidelinesTextarea.value || defaultGuidelines;

    const prompt = `Generate a multiple-choice quiz based on the following specifications:

Title: ${title}
Description: ${description}
Number of Questions: ${numQuestions}
Number of Options per Question: ${numOptions}

Inputs:
${inputs}

Scope:
${scope}

Questions Guidelines:
${guidelines}

The JSON output should follow this exact format:
{
  "title": "${title}",
  "description": "${description}",
  "questions": [
    {
      "question": "Question text here",
      "options": [
        ["Option 1 text", "*", "Feedback for option 1"],
        ["Option 2 text", "", "Feedback for option 2"],
        ["Option 3 text", "", "Feedback for option 3"],
        ["Option 4 text", "", "Feedback for option 4"]
      ]
    }
  ]
}

Important notes:
1. The "*" in the options array indicates the correct answer
2. Each option is an array with three elements: [text, correct_marker, feedback]
3. Only one option should be marked as correct (with "*")
4. The feedback should explain why the option is correct or incorrect
5. Questions should be clear and directly related to the content
6. Options should be plausible and well-distributed`;

    promptText.innerHTML = prompt;
    highlightJSON();
  }

  // Add event listeners for saving data and updating prompt
  quizTitleInput.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });
  quizDescriptionInput.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });
  numQuestionsInput.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });
  numOptionsInput.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });
  quizNameInput.addEventListener('input', saveData);
  jsonContentInput.addEventListener('input', saveData);
  inputsTextarea.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });
  scopeTextarea.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });
  guidelinesTextarea.addEventListener('input', () => {
    saveData();
    updatePrompt();
  });

  // Reset button click handler
  resetButton.addEventListener('click', resetFields);

  // Collapsible functionality
  collapsible.addEventListener('click', function(e) {
    // Don't toggle if clicking the copy icon
    if (e.target.classList.contains('copy-icon')) {
      return;
    }
    
    this.classList.toggle('active');
    content.classList.toggle('active');
    const span = this.querySelector('span');
    if (content.classList.contains('active')) {
      span.textContent = 'Hide Prompt';
    } else {
      span.textContent = 'Show Prompt';
    }
  });

  // Expand/Collapse functionality
  expandButton.addEventListener('click', function() {
    body.classList.toggle('expanded');
    const icon = this.querySelector('i');
    if (body.classList.contains('expanded')) {
      icon.className = 'fas fa-window-minimize';
    } else {
      icon.className = 'fas fa-window-maximize';
    }
  });

  // Copy prompt to clipboard
  copyPromptBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const prompt = promptText.textContent;
    navigator.clipboard.writeText(prompt).then(() => {
      const originalClass = this.className;
      this.className = 'fas fa-check copy-icon';
      setTimeout(() => {
        this.className = originalClass;
      }, 2000);
    });
  });

  // Initial load of saved data and prompt
  loadSavedData();
  updatePrompt();

  convertBtn.addEventListener('click', async function() {
    const quizName = quizNameInput.value.trim();
    const jsonContent = jsonContentInput.value.trim();

    // Validate inputs
    if (!quizName) {
      showError('Please enter a quiz name');
      return;
    }
    if (!jsonContent) {
      showError('Please enter JSON content');
      return;
    }

    try {
      // Parse JSON to validate
      const quizData = JSON.parse(jsonContent);

      // Generate XML files
      const assessmentXML = generateAssessmentXML(quizData, quizName);
      const manifestXML = generateManifestXML();
      const metaXML = generateMetaXML(quizData, quizName);

      // Create zip file
      const zip = new JSZip();
      zip.file('assessment.xml', assessmentXML);
      zip.file('imsmanifest.xml', manifestXML);
      zip.file('assessment_meta.xml', metaXML);

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Download the zip file
      const url = URL.createObjectURL(zipBlob);
      chrome.downloads.download({
        url: url,
        filename: `${quizName}.zip`,
        saveAs: true
      });

      // Hide any previous errors
      hideError();
    } catch (error) {
      showError('Invalid JSON content: ' + error.message);
    }
  });

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  function hideError() {
    errorDiv.style.display = 'none';
  }

  function generateAssessmentXML(quizData, identifier) {
    // Restructure questions to ensure the correct answer is always the first option
    quizData.questions = quizData.questions.map(question => {
      let correctOptionIndex = question.options.findIndex(option => option[1] === "*");
      if (correctOptionIndex !== -1) {
        [question.options[0], question.options[correctOptionIndex]] = [question.options[correctOptionIndex], question.options[0]];
      }
      return question;
    });

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment ident="assessment" title="${quizData.title}">
    <qtimetadata>
      <qtimetadatafield>
        <fieldlabel>cc_maxattempts</fieldlabel>
        <fieldentry>1</fieldentry>
      </qtimetadatafield>
    </qtimetadata>
    <section ident="root_section">`;

    // Generate questions
    quizData.questions.forEach((question, index) => {
      const questionId = `${identifier}_qno_${String(index + 1).padStart(2, '0')}`;
      const choices = question.options.map((option, i) => {
        return `
              <response_label ident="${questionId}_choice_${String(i + 1).padStart(2, '0')}">
                <material>
                  <mattext texttype="text/html">&lt;p&gt;${option[0]}&lt;/p&gt;</mattext>
                </material>
              </response_label>`;
      }).join("\n");

      const correctAnswers = question.options
        .filter(option => option[1] === "*")
        .map((option, i) => `<varequal respident="response1">${questionId}_choice_${String(i + 1).padStart(2, '0')}</varequal>`)
        .join("\n");

      const feedbacks = question.options.map((option, i) => {
        return `
        <itemfeedback ident="${questionId}_choice_${String(i + 1).padStart(2, '0')}_fb">
          <flow_mat>
            <material>
              <mattext texttype="text/html">&lt;p&gt;${option[2]}&lt;/p&gt;</mattext>
            </material>
          </flow_mat>
        </itemfeedback>`;
      }).join("\n");

      xmlContent += `
      <item ident="${questionId}" title="Question">
        <itemmetadata>
          <qtimetadata>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>multiple_choice_question</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>1</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>original_answer_ids</fieldlabel>
              <fieldentry>${question.options.map((_, i) => `${questionId}_choice_${String(i + 1).padStart(2, '0')}`).join(",")}</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>assessment_question_identifierref</fieldlabel>
              <fieldentry>${questionId}_assessment_question_identifierref</fieldentry>
            </qtimetadatafield>
          </qtimetadata>
        </itemmetadata>
        <presentation>
          <material>
            <mattext texttype="text/html">&lt;p&gt;${question.question}&lt;/p&gt;</mattext>
          </material>
          <response_lid ident="response1" rcardinality="Single">
            <render_choice>
              ${choices}
            </render_choice>
          </response_lid>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          ${question.options.filter(option => option[1] !== "*").map((_, i) => `
          <respcondition continue="Yes">
            <conditionvar>
              <varequal respident="response1">${questionId}_choice_${String(i + 1).padStart(2, '0')}</varequal>
            </conditionvar>
            <displayfeedback feedbacktype="Response" linkrefid="${questionId}_choice_${String(i + 1).padStart(2, '0')}_fb"/>
          </respcondition>`).join("\n")}
          <respcondition continue="No">
            <conditionvar>
              ${correctAnswers}
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>
        ${feedbacks}
      </item>`;
    });

    xmlContent += `
    </section>
  </assessment>
</questestinterop>`;

    return xmlContent;
  }

  function generateManifestXML() {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="assessment" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource http://www.imsglobal.org/profile/cc/ccv1p1/LOM/ccv1p1_lomresource_v1p0.xsd http://www.imsglobal.org/xsd/imsmd_v1p2 http://www.imsglobal.org/xsd/imsmd_v1p2p2.xsd">
  <metadata>
    <schema>IMS Content</schema>
    <schemaversion>1.1.3</schemaversion>
    <imsmd:lom>
      <imsmd:general>
        <imsmd:title>
          <imsmd:string>QTI assessment QuickQuiz addons. Copyright @ Keshav Bhandari, TXSTATE</imsmd:string>
        </imsmd:title>
      </imsmd:general>
      <imsmd:lifeCycle>
        <imsmd:contribute>
          <imsmd:date>
            <imsmd:dateTime>${currentDate}</imsmd:dateTime>
          </imsmd:date>
        </imsmd:contribute>
      </imsmd:lifeCycle>
      <imsmd:rights>
        <imsmd:copyrightAndOtherRestrictions>
          <imsmd:value>yes</imsmd:value>
        </imsmd:copyrightAndOtherRestrictions>
        <imsmd:description>
          <imsmd:string>Private (Copyrighted) - Keshav Bhandari TXSTATE</imsmd:string>
        </imsmd:description>
      </imsmd:rights>
    </imsmd:lom>
  </metadata>
  <organizations/>
  <resources>
    <resource identifier="assessment" type="imsqti_xmlv1p2">
      <file href="assessment.xml"/>
      <dependency identifierref="assessment_dependency"/>
    </resource>
    <resource identifier="assessment_dependency" type="associatedcontent/imscc_xmlv1p1/learning-application-resource" href="assessment_meta.xml">
      <file href="assessment_meta.xml"/>
    </resource>
  </resources>
</manifest>`;
  }

  function generateMetaXML(quizData, identifier) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<quiz identifier="${identifier}" xmlns="http://canvas.instructure.com/xsd/cccv1p0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://canvas.instructure.com/xsd/cccv1p0 https://canvas.instructure.com/xsd/cccv1p0.xsd">
  <title>${quizData.title}</title>
  <description>&lt;p&gt;${quizData.description}&lt;/p&gt;</description>
  <shuffle_answers>false</shuffle_answers>
  <scoring_policy>keep_highest</scoring_policy>
  <hide_results></hide_results>
  <quiz_type>assignment</quiz_type>
  <points_possible>10.0</points_possible>
  <require_lockdown_browser>false</require_lockdown_browser>
  <require_lockdown_browser_for_results>false</require_lockdown_browser_for_results>
  <require_lockdown_browser_monitor>false</require_lockdown_browser_monitor>
  <lockdown_browser_monitor_data/>
  <show_correct_answers>true</show_correct_answers>
  <anonymous_submissions>false</anonymous_submissions>
  <could_be_locked>false</could_be_locked>
  <allowed_attempts>1</allowed_attempts>
  <one_question_at_a_time>false</one_question_at_a_time>
  <cant_go_back>false</cant_go_back>
  <available>false</available>
  <one_time_results>false</one_time_results>
  <show_correct_answers_last_attempt>false</show_correct_answers_last_attempt>
  <only_visible_to_overrides>false</only_visible_to_overrides>
  <module_locked>false</module_locked>
  <assignment identifier="${identifier}">
    <title>${quizData.title}</title>
    <due_at/>
    <lock_at/>
    <unlock_at/>
    <module_locked>false</module_locked>
    <workflow_state>unpublished</workflow_state>
    <assignment_overrides>
    </assignment_overrides>
    <quiz_identifierref>${identifier}</quiz_identifierref>
    <allowed_extensions></allowed_extensions>
    <has_group_category>false</has_group_category>
    <points_possible>10.0</points_possible>
    <grading_type>points</grading_type>
    <all_day>false</all_day>
    <submission_types>online_quiz</submission_types>
    <position>1</position>
    <turnitin_enabled>false</turnitin_enabled>
    <vericite_enabled>false</vericite_enabled>
    <peer_review_count>0</peer_review_count>
    <peer_reviews>false</peer_reviews>
    <automatic_peer_reviews>false</automatic_peer_reviews>
    <anonymous_peer_reviews>false</anonymous_peer_reviews>
    <grade_group_students_individually>false</grade_group_students_individually>
    <freeze_on_copy>false</freeze_on_copy>
    <omit_from_final_grade>false</omit_from_final_grade>
    <intra_group_peer_reviews>false</intra_group_peer_reviews>
    <only_visible_to_overrides>false</only_visible_to_overrides>
    <post_to_sis>false</post_to_sis>
    <moderated_grading>false</moderated_grading>
    <grader_count>0</grader_count>
    <grader_comments_visible_to_graders>true</grader_comments_visible_to_graders>
    <anonymous_grading>false</anonymous_grading>
    <graders_anonymous_to_graders>false</graders_anonymous_to_graders>
    <grader_names_visible_to_final_grader>true</grader_names_visible_to_final_grader>
    <anonymous_instructor_annotations>false</anonymous_instructor_annotations>
    <post_policy>
      <post_manually>false</post_manually>
    </post_policy>
  </assignment>
  <assignment_group_identifierref>${identifier}</assignment_group_identifierref>
  <assignment_overrides>
  </assignment_overrides>
</quiz>`;
  }
}); 