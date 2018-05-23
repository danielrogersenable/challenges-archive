var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var Message = (function () {
        function Message(message) {
            if (message) {
                this.username = message.Username;
                this.content = message.Content;
                this.timeSubmitted = message.TimeSubmitted;
            }
        }
        Message.prototype.formattedTime = function () {
            var timeArray = moment(this.timeSubmitted).local().toArray();
            var timeStringArray = [];
            timeArray.forEach(function (part, index, theArray) {
                timeStringArray.push(("0" + part.toString()).slice(-2));
            });
            var year = timeStringArray[0], month = timeStringArray[1], day = timeStringArray[2], hour = timeStringArray[3], minute = timeStringArray[4], second = timeStringArray[5], millisecond = timeStringArray[6];
            return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
        };
        return Message;
    }());
    var TimeUnit;
    (function (TimeUnit) {
        TimeUnit[TimeUnit["Minutes"] = 0] = "Minutes";
        TimeUnit[TimeUnit["Hours"] = 1] = "Hours";
        TimeUnit[TimeUnit["Days"] = 2] = "Days";
    })(TimeUnit = App.TimeUnit || (App.TimeUnit = {}));
    function getTimeUnitDisplayName(value) {
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
    App.getTimeUnitDisplayName = getTimeUnitDisplayName;
    var Criteria = (function () {
        function Criteria() {
            var _this = this;
            this.includeSystem = ko.observable(false);
            this.take = ko.observable();
            this.timeLength = ko.observable();
            this.timeUnit = ko.observable(1);
            this.toJSON = function () {
                return {
                    includeSystem: _this.includeSystem.peek(),
                    take: _this.take.peek()
                        ? _this.take.peek()
                        : 0,
                    timeLength: _this.timeLength.peek()
                        ? _this.timeLength.peek()
                        : 0,
                    timeUnit: _this.timeUnit.peek()
                        ? _this.timeUnit.peek()
                        : 0
                };
            };
        }
        return Criteria;
    }());
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel() {
            var _this = _super.call(this) || this;
            _this.messageLog = ko.observableArray();
            _this.username = ko.observable();
            _this.content = ko.observable();
            _this.isSettingUsername = ko.observable(true);
            _this.isLoading = ko.observable(false);
            _this.criteria = ko.observable(new Criteria());
            _this.receiveSystemMessages = ko.observable(false);
            _this.loadOptionsVisible = ko.observable(false);
            _this.usernameMessage = ko.pureComputed(function () {
                if (_this.messageToSend.username) {
                    return "User: " + _this.messageToSend.username + " is now known as: " + _this.username();
                }
                else {
                    return "A new user is now known as: " + _this.username();
                }
            });
            _this.setUsernameButtonLabel = ko.pureComputed(function () {
                if (_this.isSettingUsername()) {
                    return 'Set username';
                }
                else {
                    return 'Change username';
                }
                ;
            });
            _this.setMessagePlaceholderText = ko.pureComputed(function () {
                if (_this.isSettingUsername()) {
                    return 'Set username before typing a message.';
                }
                else {
                    return 'Type message here.';
                }
                ;
            });
            _this.messageToSend = new Message();
            _this.hub = $.connection.chatHub;
            _this.hub.client.broadcastMessage = function (username, content, timeSubmitted) { return _this.receiveMessage(username, content, timeSubmitted); };
            _this.hub.connection.disconnected(function () {
                setTimeout(function () {
                    _this.startConnection();
                }, 1000);
            });
            _this.startConnection();
            return _this;
        }
        ViewModel.prototype.testEnter = function () {
            console.log("Enter");
        };
        ViewModel.prototype.toggleLoadOptionsVisible = function () {
            var tempLoadOptionsVisible = this.loadOptionsVisible.peek();
            this.loadOptionsVisible(!tempLoadOptionsVisible);
        };
        ViewModel.prototype.startConnection = function () {
            this.hub.connection.start(App.signalRConnectionSettings).done(function () {
                console.log("Connected");
            });
        };
        ViewModel.prototype.setUsername = function () {
            var tempIsSettingUsername = this.isSettingUsername();
            this.isSettingUsername(!tempIsSettingUsername);
            var systemMessage = new Message({
                Username: 'System',
                Content: this.usernameMessage(),
                TimeSubmitted: moment().toISOString()
            });
            if (this.messageToSend.username !== this.username()) {
                this.sendMessageToHub(systemMessage);
            }
            this.messageToSend.username = this.username();
            console.log(this.isSettingUsername());
        };
        ViewModel.prototype.sendMessage = function () {
            this.messageToSend.content = this.content();
            this.messageToSend.username = this.username();
            this.messageToSend.timeSubmitted = moment().toISOString();
            this.sendMessageToHub(this.messageToSend);
            this.content(null);
        };
        ViewModel.prototype.sendMessageToHub = function (transmittedMessage) {
            this.hub.server.send(transmittedMessage.username, transmittedMessage.content, transmittedMessage.timeSubmitted);
            console.log('Message sent');
        };
        ViewModel.prototype.receiveMessage = function (username, content, timeSubmitted) {
            console.log('Message received');
            var receivedMessage = new Message({
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
        };
        ViewModel.prototype.loadMessages = function () {
            var _this = this;
            if (this.isLoading()) {
                return;
            }
            this.isLoading(true);
            this.messageLog([]);
            //let data = this.criteria().toJSON();
            var data = JSON.stringify(this.criteria());
            $.ajax({
                url: 'signalRchat/api/Messages/GetMessages',
                data: data,
                type: 'PUT',
                contentType: "application/json;charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                //const messages = data.map((message) => {
                //    return new Message(message);
                //});
                //const m = data.filter((message) => {
                //    return message.Username !== "System";
                //});
                //this.messageLog(messages);
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var message = data_1[_i];
                    _this.messageLog.unshift(new Message(message));
                }
            }).always(function () {
                _this.isLoading(false);
            });
        };
        return ViewModel;
    }(App.BaseViewModel));
    var viewModel = new ViewModel();
    App.setViewModel(viewModel);
    App.signalRConnectionSettings = {
        transport: ['webSockets', 'longPolling']
    };
})(App || (App = {}));
//# sourceMappingURL=ChatRoom.js.map