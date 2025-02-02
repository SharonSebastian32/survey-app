import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import data from "../../../json/dynamicForm.json";
import "./DynamicForm.css";
import "./RadioFeedBack.css";
import Navbar from "../Header/Navbar";

const DynamicForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState({});
  const [formMeta, setFormMeta] = useState({});
  const [initialFields, setInitialFields] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionFields, setSectionFields] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [allFields, setAllFields] = useState([]);

  useEffect(() => {
    const loadForm = () => {
      const currentForm = data.find((item) => item.formId === formId);

      if (currentForm) {
        const fieldsBySection = currentForm.fields.reduce((acc, field) => {
          acc[field.sectionId] = acc[field.sectionId] || [];
          acc[field.sectionId].push(field);
          return acc;
        }, {});

        const allFieldsCombined = [
          ...(currentForm.initialFields || []),
          ...(currentForm.fields || []),
        ];

        const initialData = allFieldsCombined.reduce((acc, field) => {
          acc[field.fieldId] = "";
          return acc;
        }, {});

        setFormMeta({
          formName: currentForm.formName,
          formDescription: currentForm.formDescription,
          typeOfListing: currentForm.typeOfListing,
          time: currentForm.time,
          languages: currentForm.languages,
        });
        setInitialFields(currentForm.initialFields || []);
        setSections(currentForm.sections || []);
        setSectionFields(fieldsBySection);
        setAllFields(allFieldsCombined);
        setFormData(initialData);

        console.log("Form data loaded:", currentForm);
      } else {
        console.error("Form not found for formId:", formId);
      }
    };

    loadForm();
  }, [formId]);

  const handleChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const renderField = (field) => {
    const label = field.translations?.[selectedLanguage] || field.label;
    const placeholder =
      field.translationsPlaceholder?.[selectedLanguage] || field.placeholder;

    switch (field.type) {
      case "textbox":
        return (
          <input
            type="text"
            id={field.fieldId}
            name={field.fieldId}
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            placeholder={placeholder}
            required={field.required}
          />
        );
      case "email":
        return (
          <input
            type="email"
            id={field.fieldId}
            name={field.fieldId}
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            placeholder={placeholder}
            required={field.required}
          />
        );
      case "date":
        return (
          <input
            type={field.type}
            id={field.fieldId}
            name={field.fieldId}
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            required={field.required}
          />
        );
      case "radio":
        return (
          <div className="radio-group2">
            {field.options.map((option) => (
              <div key={option.id} className="radio-item2">
                <label
                  style={{
                    padding: "10px 25px",
                    fontWeight: "500",
                    fontSize: "18px",
                    color:
                      formData[field.fieldId] === option.id ? "white" : "black",
                    cursor: "pointer",
                    backgroundColor:
                      formData[field.fieldId] === option.id
                        ? "rgb(8, 8, 8)"
                        : "rgb(222, 251, 205)",
                    border:
                      option.translations?.[selectedLanguage]?.length === 1 ||
                      option.label.length === 1
                        ? "1px solid black"
                        : "none",
                    borderRadius:
                      option.translations?.[selectedLanguage]?.length === 1 ||
                      option.label.length === 1
                        ? "50%"
                        : "50px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width:
                      option.translations?.[selectedLanguage]?.length === 1 ||
                      option.label.length === 1
                        ? "50px"
                        : "auto",
                    height:
                      option.translations?.[selectedLanguage]?.length === 1 ||
                      option.label.length === 1
                        ? "50px"
                        : "auto",
                  }}
                  htmlFor={`${field.fieldId}-${option.id}`}
                  id="radio-label"
                  onClick={() => {
                    handleChange(field.fieldId, option.id);
                    console.log("Gender:", option.label);
                  }}
                >
                  {option.translations?.[selectedLanguage] || option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "selectbox":
        return (
          <div className="select-container">
            <select
              id={field.fieldId}
              name={field.fieldId}
              value={formData[field.fieldId] || ""}
              onChange={(e) => handleChange(field.fieldId, e.target.value)}
              required={field.required}
            >
              <option value="">{placeholder}</option>
              {field.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.translations?.[selectedLanguage] || option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case "textarea":
        return (
          <textarea
            id={field.fieldId}
            name={field.fieldId}
            value={formData[field.fieldId] || ""}
            onChange={(e) => handleChange(field.fieldId, e.target.value)}
            placeholder={placeholder}
            required={field.required}
          />
        );
      case "matrix_checkbox":
        return (
          <div className="matrix-checkbox">
            <table>
              <thead>
                <tr>
                  <th></th>
                  {field.columns.map((column) => (
                    <th key={column.id}>
                      {column.translations?.[selectedLanguage] || column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ backgroundColor: "#f8f8f8" }}>
                      {row.translations?.[selectedLanguage] || row.label}
                    </td>
                    {field.columns.map((column, colIndex) => (
                      <td
                        key={column.id}
                        style={
                          colIndex === field.columns.length - 1
                            ? {
                                borderTopRightRadius: "20px",
                                borderBottomRightRadius: "20px",
                              }
                            : {}
                        }
                      >
                        <input
                          type="checkbox"
                          name={`${field.fieldId}-${row.id}`}
                          value={column.id}
                          checked={
                            formData[field.fieldId]?.[row.id] === column.id
                          }
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? column.id
                              : null;
                            setFormData((prev) => ({
                              ...prev,
                              [field.fieldId]: {
                                ...prev[field.fieldId],
                                [row.id]: newValue,
                              },
                            }));
                          }}
                          required={field.required}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "matrix_radio":
        return (
          <div className="matrix-checkbox">
            <table>
              <thead>
                <tr>
                  <th></th>
                  {field.columns.map((column) => (
                    <th key={column.id}>
                      {column.translations?.[selectedLanguage] || column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {field.rows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ backgroundColor: "#f8f8f8" }}>
                      {row.translations?.[selectedLanguage] || row.label}
                    </td>
                    {field.columns.map((column, colIndex) => (
                      <td
                        key={column.id}
                        style={
                          colIndex === field.columns.length - 1
                            ? {
                                borderTopRightRadius: "20px",
                                borderBottomRightRadius: "20px",
                              }
                            : {}
                        }
                      >
                        <input
                          type="checkbox"
                          name={`${field.fieldId}-${row.id}`}
                          value={column.id}
                          checked={
                            formData[field.fieldId]?.[row.id] === column.id
                          }
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? column.id
                              : null;
                            setFormData((prev) => ({
                              ...prev,
                              [field.fieldId]: {
                                ...prev[field.fieldId],
                                [row.id]: newValue,
                              },
                            }));
                          }}
                          required={field.required}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "matrix_radio_feedback":
        return (
          <div className="matrix-container">
            <div className="matrix-row">
              <div
                className="matrix-cell"
                id="metr-cell"
                style={{
                  borderBottomLeftRadius: "50px",
                  borderTopLeftRadius: "50px",
                  backgroundColor: "#d6d6d6",
                }}
              ></div>

              {field.columns.map((column, colIndex) => (
                <div
                  className="matrix-cell"
                  key={column.id}
                  style={
                    colIndex === field.columns.length - 1
                      ? {
                          borderTopRightRadius: "50px",
                          borderBottomRightRadius: "50px",
                          backgroundColor: "#d6d6d6",
                        }
                      : {
                          backgroundColor: "#d6d6d6",
                        }
                  }
                >
                  {column.translations?.[selectedLanguage] || column.label}
                </div>
              ))}
            </div>

            {field.rows.map((row) => (
              <>
                <p className="pholder">
                  {row.translations?.[selectedLanguage] || row.label}{" "}
                </p>

                <div className="matrix-row" key={row.id}>
                  <div
                    className="matrix-cell"
                    style={{
                      borderBottomLeftRadius: "50px",
                      borderTopLeftRadius: "50px",
                    }}
                  >
                    <p> {row.translations?.[selectedLanguage] || row.label} </p>
                  </div>

                  {field.columns.map((column, colIndex) => (
                    <div
                      className="matrix-cell"
                      key={column.id}
                      style={
                        colIndex === field.columns.length - 1
                          ? {
                              borderTopRightRadius: "50px",
                              borderBottomRightRadius: "50px",
                            }
                          : {}
                      }
                    >
                      <div
                        className="radio-group"
                        style={{ marginTop: "25px" }}
                      >
                        <input
                          type="radio"
                          name={`${field.fieldId}-${row.id}`}
                          value={column.id}
                          checked={
                            formData[field.fieldId]?.[row.id] === column.id
                          }
                          onChange={() => {
                            setFormData((prev) => ({
                              ...prev,
                              [field.fieldId]: {
                                ...prev[field.fieldId],
                                [row.id]: column.id,
                              },
                            }));
                          }}
                          required={field.required}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </div>
        );

      case "matrix__feedcheckback":
        return (
          <div className="matrix-container">
            <div className="matrix-row">
              <div
                className="matrix-cell"
                style={{
                  borderBottomLeftRadius: "50px",
                  borderTopLeftRadius: "50px",
                  backgroundColor: "#d6d6d6",
                }}
              ></div>

              {field.columns.map((column, colIndex) => (
                <div
                  className="matrix-cell"
                  key={column.id}
                  style={
                    colIndex === field.columns.length - 1
                      ? {
                          borderTopRightRadius: "50px",
                          borderBottomRightRadius: "50px",
                          backgroundColor: "#d6d6d6",
                        }
                      : {
                          backgroundColor: "#d6d6d6",
                        }
                  }
                >
                  {column.translations?.[selectedLanguage] || column.label}
                </div>
              ))}
            </div>
            <br />
            {field.rows.map((row) => (
              <div className="matrix-row" key={row.id}>
                <div
                  className="matrix-cell"
                  style={{
                    borderBottomLeftRadius: "50px",
                    borderTopLeftRadius: "50px",
                  }}
                >
                  {row.translations?.[selectedLanguage] || row.label}
                </div>

                {field.columns.map((column, colIndex) => (
                  <div
                    className="matrix-cell"
                    key={column.id}
                    style={
                      colIndex === field.columns.length - 1
                        ? {
                            borderTopRightRadius: "50px",
                            borderBottomRightRadius: "50px",
                          }
                        : {}
                    }
                  >
                    <div
                      className="checkbox-group"
                      style={{ marginTop: "25px" }}
                    >
                      <input
                        type="checkbox"
                        name={`${field.fieldId}-${row.id}`}
                        value={column.id}
                        checked={
                          Array.isArray(formData[field.fieldId]?.[row.id])
                            ? formData[field.fieldId]?.[row.id].includes(
                                column.id
                              )
                            : false
                        }
                        onChange={(e) => {
                          const fieldValues =
                            formData[field.fieldId]?.[row.id] || [];
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              [field.fieldId]: {
                                ...prev[field.fieldId],
                                [row.id]: [...fieldValues, column.id],
                              },
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              [field.fieldId]: {
                                ...prev[field.fieldId],
                                [row.id]: fieldValues.filter(
                                  (value) => value !== column.id
                                ),
                              },
                            }));
                          }
                        }}
                        required={field.required}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <br />
          </div>
        );
      case "checkbox":
        return (
          <div className="checkbox-group">
            {field.options.map((option) => (
              <div
                key={option.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  textAlign: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  style={{
                    verticalAlign: "middle",
                    position: "relative",
                    bottom: "1px",
                  }}
                  type="checkbox"
                  id={`${field.fieldId}-${option.id}`}
                  name={field.fieldId}
                  value={option.id}
                  checked={formData[field.fieldId]?.includes(option.id)}
                  onChange={(e) => {
                    const currentValues = formData[field.fieldId] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.id]
                      : currentValues.filter((v) => v !== option.id);
                    handleChange(field.fieldId, newValues);
                  }}
                  required={field.required}
                />
                <label
                  htmlFor={`${field.fieldId}-${option.id}`}
                  style={{ paddingTop: ".58em" }}
                >
                  {option.translations?.[selectedLanguage] || option.label}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderFormContent = () => {
    switch (formMeta.typeOfListing) {
      case "all-question":
        return (
          <form onSubmit={handleSubmit} className="form-container">
            {initialFields.length > 0 && (
              <div>
                <h3>Initial Questions</h3>
                {initialFields.map((field) => (
                  <div key={field.fieldId}>
                    <label htmlFor={field.fieldId}>
                      {field.translations?.[selectedLanguage] || field.label}
                      {field.required && "*"}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            )}
            {sections.map((section) => (
              <div key={section.sectionId}>
                <h3>{section.sectionName}</h3>
                {sectionFields[section.sectionId]?.map((field) => (
                  <div key={field.fieldId}>
                    <label htmlFor={field.fieldId}>
                      {field.translations?.[selectedLanguage] || field.label}
                      {field.required && "*"}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
                marginLeft: "auto",
              }}
            >
              <button id="single-sbmt-btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        );
      case "one-page-per-section":
        const currentSection = sections[currentPage];
        const isLastSection = currentPage === sections.length - 1;
        const isFirstSection = currentPage === 0;

        return (
          <form
            onSubmit={isLastSection ? handleSubmit : (e) => e.preventDefault()}
            className="form-container"
          >
            <h3>{currentSection.sectionName}</h3>
            {sectionFields[currentSection.sectionId]?.map((field) => (
              <div key={field.fieldId}>
                <label htmlFor={field.fieldId}>
                  {field.translations?.[selectedLanguage] || field.label}
                  {field.required && "*"}
                </label>
                {renderField(field)}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              {!isFirstSection && (
                <button
                  type="button"
                  id="previous-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
              )}

              {!isLastSection ? (
                <button
                  type="button"
                  id="next-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              ) : (
                <button type="submit" id="submit-btn">
                  Submit
                </button>
              )}
            </div>
          </form>
        );
      case "one-page-per-question":
        const currentField = allFields[currentPage];
        const isLastQuestion = currentPage === allFields.length - 1;
        const isFirstQuestion = currentPage === 0;

        return (
          <form
            onSubmit={isLastQuestion ? handleSubmit : (e) => e.preventDefault()}
            className="form-container"
          >
            <div>
              <label htmlFor={currentField.fieldId}>
                {currentField.translations?.[selectedLanguage] ||
                  currentField.label}
                {currentField.required && "*"}
              </label>
              {renderField(currentField)}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              {!isFirstQuestion && (
                <button
                  type="button"
                  id="previous-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
              )}
              {!isLastQuestion ? (
                <button
                  type="button"
                  id="next-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              ) : (
                <button id="submit-btn" type="submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="form-container">
          <h2 className="form-title">{formMeta.formName}</h2>
          <p>{formMeta.formDescription}</p>
          <select
            className="language-selector-combo"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {/* map less */}
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div style={{}}>{renderFormContent()}</div>
      </div>
    </>
  );
};

export default DynamicForm;
