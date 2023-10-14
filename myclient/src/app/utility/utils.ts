
export const yyyymmdd = ((inputDate: Date) =>  {
    const dateObj = new Date(inputDate);
    console.log(dateObj);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

export function mMMMddyyyy(inputDate: Date) : string  {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return inputDate.toLocaleDateString('en-US', options);
};


export function currencyFormat(amount: number) {
    return '$' + amount.toFixed(2);
  }