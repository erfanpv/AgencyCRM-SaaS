import React from "react";

const AgencyIdPage = ({ params }: { params: { agencyId: string } }) => {
  return <div>{params.agencyId}</div>;
};

export default AgencyIdPage;
