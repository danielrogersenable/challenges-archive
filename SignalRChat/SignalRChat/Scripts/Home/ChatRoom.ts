module App {

    declare type MessageModel = App.ServerTypes.Models.Api.MessageModel;


    class Message {
        public username: string;
        public content: string;
        public timeSubmitted: string;

        constructor(message?: MessageModel) {
            if (message) {
                this.username = message.Username;
                this.content = message.Content;
                this.timeSubmitted = message.TimeSubmitted;
            }
        }

        formattedTime() {
            let timeArray = moment(this.timeSubmitted).local().toArray();
            let timeStringArray = [];
            timeArray.forEach(function (part, index, theArray) {
                timeStringArray.push((`0${part.toString()}`).slice(-2));
            });
            let [year, month, day, hour, minute, second, millisecond] = timeStringArray;

            return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
        }
    }

    export enum TimeUnit {
        Minutes = 0,
        Hours = 1,
        Days = 2
    }

    export function getTimeUnitDisplayName(value: TimeUnit) {
        switch (value) {
            case 0:
                return "Minutes";
            case 1:
                return "Hours";
            case 2:
                return "Days";
            default:
                return "";
        }
    }

    interface ISearchCriteriaModel {
        // Duplicate this with the file in Models/Api/SearchCriteriaModel.
        // In a project I would use ServerTypes.tt, but didn't know how to set this up

        includeSystem: boolean;
        take: number;
        timeLength: number;
        timeUnit: TimeUnit

    }

    class Criteria {

        includeSystem = ko.observable<boolean>(false);
        take = ko.observable<number>();
        timeLength = ko.observable<number>();
        timeUnit = ko.observable<TimeUnit>(1);

        toJSON = (): ISearchCriteriaModel => {
            return {
                includeSystem: this.includeSystem.peek(),
                take: this.take.peek()
                    ? this.take.peek()
                    : 0,
                timeLength: this.timeLength.peek()
                    ? this.timeLength.peek()
                    : 0,
                timeUnit: this.timeUnit.peek()
                    ? this.timeUnit.peek()
                    :0
            };
        };


    }

    class ViewModel extends BaseViewModel {
        constructor() {
            super()
            this.messageToSend = new Message();

            this.hub = (<any>$.connection).chatHub;
            this.hub.client.broadcastMessage = (username, content, timeSubmitted) => this.receiveMessage(username, content, timeSubmitted);
            this.hub.connection.disconnected(() => {
                setTimeout(() => {
                    this.startConnection();
                }, 1000);
            });

            this.startConnection();

        }

        messageLog = ko.observableArray<Message>();
        messageToSend: Message;
        username = ko.observable<string>();
        content = ko.observable<string>();
        isSettingUsername = ko.observable<boolean>(true);
        isLoading = ko.observable<boolean>(false);
        criteria = ko.observable(new Criteria());
        receiveSystemMessages = ko.observable<boolean>(false);
        loadOptionsVisible = ko.observable<boolean>(false);
        private hub: any;

        testEnter() {
            console.log("Enter");
        }

        usernameMessage = ko.pureComputed(() :string => {
            if (this.messageToSend.username) {
                return `User: ${this.messageToSend.username} is now known as: ${this.username()}`;
            }
            else {
                return `A new user is now known as: ${this.username()}`;
            }
        });

        setUsernameButtonLabel = ko.pureComputed(() :string => {
            if (this.isSettingUsername()) {
                return 'Set username';
            }
            else {
                return 'Change username';
            };
        });

        setMessagePlaceholderText = ko.pureComputed((): string => {
            if (this.isSettingUsername()) {
                return 'Set username before typing a message.';
            }
            else {
                return 'Type message here.';
            };

        })

        toggleLoadOptionsVisible(): void {
            const tempLoadOptionsVisible = this.loadOptionsVisible.peek();
            this.loadOptionsVisible(!tempLoadOptionsVisible);
        }

        startConnection(): void {
            this.hub.connection.start(App.signalRConnectionSettings).done(() => {
                console.log("Connected");
            });
        }

        setUsername() {
            let tempIsSettingUsername = this.isSettingUsername();
            this.isSettingUsername(!tempIsSettingUsername);
            let systemMessage = new Message({
                Username: 'System',
                Content: this.usernameMessage(),
                TimeSubmitted: moment().toISOString()
            });
            if (this.messageToSend.username !== this.username()) {
                this.sendMessageToHub(systemMessage);
            }
            this.messageToSend.username = this.username();
            console.log(this.isSettingUsername());
        }

        sendMessage() {
            this.messageToSend.content = this.content();
            this.messageToSend.username = this.username();
            this.messageToSend.timeSubmitted = moment().toISOString();
            this.sendMessageToHub(this.messageToSend);
            this.content(null);
        }

        sendMessageToHub(transmittedMessage: Message){
            this.hub.server.send(transmittedMessage.username, transmittedMessage.content, transmittedMessage.timeSubmitted);
            console.log('Message sent');
        }

        receiveMessage(username: string, content: string, timeSubmitted: string) {
            console.log('Message received');

            let receivedMessage = new Message({
                Username: username,
                Content: content,
                TimeSubmitted: timeSubmitted
            });
            if (!this.receiveSystemMessages() && receivedMessage.username === "System") {
                console.log('System message received but not loaded due to user preference');
            }
            else {
                this.messageLog.unshift(receivedMessage);
            }

        }

        loadMessages() {
            if (this.isLoading()) {
                return;
            }
            this.isLoading(true);
            this.messageLog([]);

            //let data = this.criteria().toJSON();
            const data = JSON.stringify(this.criteria());

            $.ajax({
                url: 'signalRchat/api/Messages/GetMessages',
                data: data,
                type: 'PUT',
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done((data: MessageModel[]) => {

                //const messages = data.map((message) => {
                //    return new Message(message);
                //});

                //const m = data.filter((message) => {
                //    return message.Username !== "System";
                //});

                //this.messageLog(messages);

                for (let message of data) {
                    this.messageLog.unshift(new Message(message));
                }
            }).always(() => {
                this.isLoading(false);
            });

        }
    }

    var viewModel = new ViewModel();
    App.setViewModel(viewModel);

    export var signalRConnectionSettings: any = {
        transport: ['webSockets', 'longPolling']
    };

}