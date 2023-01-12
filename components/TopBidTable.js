import React, { useEffect, useState } from "react";

const TopBidTable = ({ users }) => {
  const [bids, setBids] = useState(users);
  const [loading, setLoading] = useState(true);

  const getBids = async () => {
    setTimeout(() => {
      setBids(STUB_bids);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (users) {
      setLoading(false);
    }
  }, [users]);
  return (
    <div className="flex flex-col gap-[2rem] items-center w-full my-[2rem]">
      <div
        className={`border border-1 border-slate-700 rounded flex flex-col w-[90%] md:w-[80%] px-[1.5rem] h-[70%] overflow-auto`}
      >
        <Bids bids={users} loading={loading} />
      </div>
    </div>
  );
};

export default TopBidTable;

const Bids = ({ bids, loading }) => {
  if (!bids) {
    return null;
  }

  const formatAddress = (address) => {
    if (!address) return;
    return `${address.substring(0, 5)}....${address.substring(36, 42)}`;
  };

  return (
    <div className="flex flex-col w-full divide-y divide-slate-700">
      <h2 className="font-pixel text-[4vw] md:text-[2vw] my-[1.75rem] text-center">
        Top Bidders
      </h2>

      {bids.map((bid, i) => {
        return (
          <div
            className="flex justify-between basis-1/4 items-center p-[1rem] font-vcr"
            key={`${bid.address}-${i}`}
          >
            {!loading ? (
              <>
                <span>
                  <strong>{bid.bidAmount}</strong>
                </span>
                <span className="lg:hidden">{formatAddress(bid.address)}</span>
                <span className="hidden lg:block">{bid.address}</span>
              </>
            ) : (
              <div className="animate-pulse flex space-x-4 w-full">
                <div className="flex-1 py-1">
                  <div className="space-y-2">
                    <div className="h-[.5rem] bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
