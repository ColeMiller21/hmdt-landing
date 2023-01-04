import React, { useEffect, useState } from "react";

const STUB_bids = [
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 80 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 70 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 60 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 50 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 40 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 30 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 30 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 20 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 10 },
  { address: "0xEd42a25A7fDE348473e57DB6DB4B86893b7B845B", bid: 10 },
];

const TopBidTable = () => {
  const [bids, setBids] = useState(STUB_bids);
  const [loading, setLoading] = useState(true);

  const getBids = async () => {
    setTimeout(() => {
      setBids(STUB_bids);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    (async () => {
      await getBids();
    })();
  }, []);
  return (
    <div className="flex flex-col gap-[2rem] items-center w-full my-[2rem]">
      <h2 className="font-pixel text-[4vw] md:text-[2vw] ">Top Bidders</h2>
      <div
        className={`border border-1 border-slate-700 rounded flex flex-col w-[90%] md:w-[80%] px-[1.5rem] h-[70%] overflow-auto`}
      >
        <Bids bids={bids} loading={loading} />
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
      {bids.map((bid) => {
        return (
          <div className="flex justify-between basis-1/4 items-center p-[1rem] font-vcr">
            {!loading ? (
              <>
                <span>
                  <strong>{bid.bid}</strong>
                </span>
                <span className="lg:hidden">{formatAddress(bid.address)}</span>
                <span className="hidden lg:block">{bid.address}</span>
              </>
            ) : (
              <div class="animate-pulse flex space-x-4 w-full">
                <div class="flex-1 py-1">
                  <div class="space-y-2">
                    <div class="h-[.5rem] bg-slate-700 rounded"></div>
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
