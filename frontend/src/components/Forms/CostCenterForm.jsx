import React from 'react';
import GenericForm from './GenericForm';

const CostCenterForm = ({ onBack }) => {
  const columns = [
    { key: 'id', label: 'ID', placeholder: 'ID', type: 'text' },
    { key: 'name', label: 'Name', placeholder: 'Name', type: 'text' },
    { key: 'parentCostCenter', label: 'Parent Cost Center', placeholder: 'Parent Cost Center', type: 'text' },
    { key: 'company', label: 'Company', placeholder: 'Company', type: 'text' },
    { key: 'isGroup', label: 'Is Group', placeholder: 'Is Group', type: 'select', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]},
    { key: 'disabled', label: 'Disabled', placeholder: 'Disabled', type: 'select', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]}
  ];

  const data = []; // Empty for now

  return (
    <GenericForm
      title="Cost Center"
      onBack={onBack}
      columns={columns}
      data={data}
      emptyMessage="You haven't created any Cost Center entries yet"
      createButtonText="Create your first Cost Center entry"
      addButtonText="Add Cost Center"
    />
  );
};

export default CostCenterForm;
