import React from "react";

const Detail = ({ detailTitle, detailData }) => {
  return (
    <div className="flex gap-2">
      <span className="font-bold">{detailTitle}:</span>
      <span className="">{detailData}</span>
    </div>
  );
};

export default Detail;
