const kafka = require('kafka-node');
var request = require('request');
Consumer = kafka.Consumer;
client = new kafka.Client();
consumer = new Consumer(client,
    [{ topic: 'slack', offset: 0 }],
    {
        autoCommit: true
    }
);


consumer.on('message', function (message) {
    if (message.value.replace(/[\n\t\r]/g, "") == 'send') {
        request.post(
            'http://a261e529.ngrok.io/incoming',
            {
                json: {
                    'id': '1234',
                    'link': 'https://somehelpdesk.localhost',
                    'title': 'Test ticket',
                    'description': 'Oh no! Something went wrong and now everything is on fire :fire:',
                    'requester': 'Bob',
                    'status': 'Open',
                    'agent': 'Jane',
                    'priority': 'High'
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
    }
});

consumer.on('error', function (err) {
    console.log('Error:', err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:', err);
})
