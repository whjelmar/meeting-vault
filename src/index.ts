const events = ical.sync.parseFile('example-calendar.ics');
// loop through events and log them
for (const event of Object.values(events)) {
    console.log(
        'Summary: ' + event.summary +
        '\nDescription: ' + event.description +
        '\nStart Date: ' + event.start.toISOString() +
        '\n'
    );
};
