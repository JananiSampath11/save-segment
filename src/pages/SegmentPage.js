import React, { useState, useRef, useEffect } from 'react';
 
const SegmentPage = () => {
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [newSchema, setNewSchema] = useState('');
  const [newSchemaOptions, setNewSchemaOptions] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);
  const [numDropdowns, setNumDropdowns] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
 

const fetchdata = async (formData) => {
  try {
    const webhookUrl = 'https://webhook.site/bb8c348a-8d94-429a-b65b-d0ebf6053e8a';
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
 
    if (response.ok) {
      console.log('Sent successfully!');
    } else {
      console.error('Failed to send :', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  }
  const resetFormData = () => {
    setSegmentName('');
    setSelectedSchemas([]);
    setNewSchema('');
  };
useEffect(() => {
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
      resetFormData();
    }
  };

  document.addEventListener('mousedown', handleOutsideClick);

  return () => {
    document.removeEventListener('mousedown', handleOutsideClick);
  };
}, []); 
  const handleSaveSegment = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas,
    };
    console.log(data);
    const formData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schemaItem => ({ [schemaItem]: schemaItem }))
    };
      fetchdata(formData);
    setShowModal(false);
  };
 
  const handleAddNewSchema = () => {
    if (newSchema) {
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setNewSchema('');
      setNumDropdowns(numDropdowns + 1);
    }
  };
 
  const handleNewSchemaChange = (e) => {
    setNewSchema(e.target.value);
  };
 
  const handleSchemaChange = (index, e) => {
    const updatedSchemas = [...selectedSchemas];
    updatedSchemas[index] = e.target.value;
    setSelectedSchemas(updatedSchemas);
  };
 
  const remainingOptions = newSchemaOptions.filter(option => !selectedSchemas.includes(option.value));
  const shouldRenderAddButton = remainingOptions.length > 0;
 
  return (
    <div>
      <button className='p-3' onClick={() => setShowModal(true)}>Save Segment</button>
      {/* MODAL POPUP */}
      {showModal && (
        <div className="modal-background float-end ">
          <div ref={modalRef} className="modal-content  vh-100">
            <div className="modal-header popup-header text-light d-flex justify-content-start">
              <i class="fa-solid fa-less-than me-4 fs-4"></i><h4>Saving Segment</h4>
            </div>
            <div className="modal-body d-flex flex-column">
              {/* INPUT FOR SEGMENT NAME */}
              <label htmlFor="SegmentName" className='mb-3'>Enter the Name of the Segment</label>
              <input
                id='SegmentName'
                className='mb-4 py-2 rounded-3 px-3'
                type="text"
                placeholder="Name of the Segment"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
              <p>To save your segment, you need to add the schemas to build the query</p>
              <div className='d-flex justify-content-end mb-5 mt-3'><p className="d-inline me-3"><i class="fa-solid fa-circle text-success fs-5"></i> - User Traits</p><p className='d-inline'><i class="fa-solid fa-circle text-danger fs-5"></i> - Group Traits</p></div>
              {[...Array(numDropdowns)].map((_, index) => (
                <>
                  <div className="row px-3" key={index}>
                    <div className="col-1" >
                      {selectedSchemas[index] === "first_name"? <i class="fa-solid fa-circle text-success fs-5 px-0"></i>: <i class="fa-solid fa-circle text-danger fs-5 px-0"></i>}
                     </div>
                    <div className="col-10">
                      {/* SELECTING SCHEMAS */}
                      <select className='mb-4 w-100 p-2' key={index} value={selectedSchemas[index]} onChange={(e) => handleSchemaChange(index, e)}>
                        <option value="">Select Schema</option>
                        {newSchemaOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-1">
                      <span class="badge bg-secondary remove-btn "><i class="fa-solid fa-minus fs-4"></i></span>
                    </div>
                  </div>
                </>
              ))}
              <>
                  <div className="row px-3">
                  <div className="col-1">
                  </div>
                  <div className="col-10">
                    {/*  DROPDOWN FOR ADDING SCHEMAS */}
                      <select className='mb-4 w-100 p-2'
                        value={newSchema}
                        onChange={handleNewSchemaChange}
                      >
                        <option value="">Add Schema to Segment</option>
                        {remainingOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-1">
                    </div>
                  </div>
              </>
              {/* FOR ADDING NEW SCHEMA DROPDOWN */}
              {shouldRenderAddButton && (
                <button className='w-50 border-0 bg-transparent text-sea-green fw-bold' onClick={handleAddNewSchema}>+ Add New Schema</button>
              )}
            </div>
            <div className="modal-footer d-flex justify-content-start">
              {/* TO SAVE THE DATA */}
              <button onClick={handleSaveSegment} className='save-seg-btn border-0 text-light px-3 py-3 rounded-3'>Save the Segment</button>
              {/* TO CLEAR THE DATA */}
              {/* <button className="close-button bg-white text-danger border-0 px-3 py-3 rounded-3" onClick={() => setShowModal(false)}>Cancel</button> */}
              <button className="close-button bg-white text-danger border-0 px-3 py-3 rounded-3" onClick={() => resetFormData()}>Cancel</button>
 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default SegmentPage;