export const format_date = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // let num_date = date.toLocaleDateString("en-US"); // 9/17/2016
    const long_date = date.toLocaleDateString("en-US", options); // Saturday, September 17, 2016
    return long_date
}