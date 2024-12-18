import request from "config";

const getTotalAmountByMonth = async (year = new Date().getFullYear()) => {
  const res = await request({
    method: "GET",
    path: `/api/statistica/month/${year}`,
  });
  return res;
};

const getTotalAmountByYear = async (year = new Date().getFullYear()) => {
  const res = await request({
    method: "GET",
    path: `/api/statistica/year/${year}`,
  });
  return res;
};

export {getTotalAmountByMonth, getTotalAmountByYear};