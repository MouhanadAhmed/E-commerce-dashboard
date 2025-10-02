import { FC } from "react";

type Props = {
  lastLogin?: string;
};

const UserLastLoginCell: FC<Props> = ({ lastLogin }) => {
  const calculateTimeDifference = (timestamp) => {
    if (!timestamp) {
      return "";
    }
    const timestampDate = new Date(timestamp);
    const now = new Date();

    const differenceInMilliseconds = now - timestampDate;

    const oneMinute = 1000 * 60;
    const oneHour = 1000 * 60 * 60;
    const oneDay = 1000 * 60 * 60 * 24;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;

    let formattedDifference;

    if (differenceInMilliseconds < oneDay) {
      if (differenceInMilliseconds < oneHour) {
        const differenceInMinutes = Math.floor(
          differenceInMilliseconds / oneMinute,
        );
        formattedDifference = `${differenceInMinutes} minutes ago`;
      } else {
        const differenceInHours = Math.floor(
          differenceInMilliseconds / oneHour,
        );
        formattedDifference = `${differenceInHours} hours ago`;
      }
    } else if (differenceInMilliseconds < oneDay * 2) {
      formattedDifference = "yesterday";
    } else if (differenceInMilliseconds < oneWeek) {
      const differenceInDays = Math.floor(differenceInMilliseconds / oneDay);
      formattedDifference = `${differenceInDays} days ago`;
    } else {
      const differenceInWeeks = Math.floor(differenceInMilliseconds / oneWeek);
      formattedDifference = `${differenceInWeeks} weeks ago`;
    }

    return formattedDifference;
  };

  return (
    <div className="badge badge-light fw-bolder">
      {calculateTimeDifference(lastLogin)}
    </div>
  );
};

{
  /* <div className='badge badge-light fw-bolder'>{last_login}</div> */
}

export { UserLastLoginCell };
