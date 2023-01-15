import React, { useEffect } from "react";

const ResponseMessage = ({ error, success }) => {
  useEffect(() => {}, [success, error]);
  return (
    <>
      {error ? (
        <span className="font-vcr text-red-500 text-center">{error}</span>
      ) : (
        <></>
      )}
      {success ? (
        <span className="font-vcr text-green-500 text-center">{success}</span>
      ) : (
        <></>
      )}
    </>
  );
};

export default ResponseMessage;
