const ClipCC = require('clipcc-extension');

class ExampleExtension extends ClipCC.Extension {
    init() {
        var requestToken = null;
        var requestTimesLeft = 60;

        ClipCC.API.addCategory({
            categoryId: 'com.extension.githubapis.category',
            messageId: 'com.extension.githubapis.category.name',
            color: '#4D97FF'
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.userinfo',
            type: ClipCC.Type.BlockType.REPORTER,
            messageId: 'com.extension.githubapis.userinfo',
            categoryId: 'com.extension.githubapis.category',
            argument: {
                USER: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'Clipteam'
                },
                NAME: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'location'
                },
            },
            function: args => this.GetUserInfo(args.USER, args.NAME)
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.userrepos',
            type: ClipCC.Type.BlockType.REPORTER,
            messageId: 'com.extension.githubapis.userrepos',
            categoryId: 'com.extension.githubapis.category',
            argument: {
                USER: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'Clipteam'
                }
            },
            function: args => this.GetUserRepos(args.USER)
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.userevents',
            type: ClipCC.Type.BlockType.REPORTER,
            messageId: 'com.extension.githubapis.userevents',
            categoryId: 'com.extension.githubapis.category',
            argument: {
                USER: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'Clipteam'
                }
            },
            function: args => this.GetUserEvents(args.USER)
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.repoinfo',
            type: ClipCC.Type.BlockType.REPORTER,
            messageId: 'com.extension.githubapis.repoinfo',
            categoryId: 'com.extension.githubapis.category',
            argument: {
                REPO_NAME: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'LLK/scratch-gui'
                },
                NAME: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'description'
                },
            },
            function: args => this.GetRepoInfo(args.REPO_NAME, args.NAME)
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.repocontent',
            type: ClipCC.Type.BlockType.REPORTER,
            messageId: 'com.extension.githubapis.repocontent',
            categoryId: 'com.extension.githubapis.category',
            argument: {
                REPO_NAME: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'LLK/scratch-gui'
                },
                PATH: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: '/'
                },
            },
            function: args => this.GetRepoContent(args.REPO_NAME, args.PATH)
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.timesleft',
            type: ClipCC.Type.BlockType.REPORTER,
            messageId: 'com.extension.githubapis.timesleft',
            categoryId: 'com.extension.githubapis.category',
            argument: {
            },
            function: () => { return this.requestTimesLeft }
        });

        ClipCC.API.addBlock({
            opcode: 'com.extension.githubapis.settoken',
            type: ClipCC.Type.BlockType.COMMAND,
            messageId: 'com.extension.githubapis.settoken',
            categoryId: 'com.extension.githubapis.category',
            argument: {
                TOKEN: {
                    type: ClipCC.Type.ArgumentType.STRING,
                    default: 'your_token'
                }
            },
            function: args => this.SetRequestToken(args.TOKEN)
        });
    }

    uninit() {
        ClipCC.API.removeCategory('com.extension.githubapis.category');
    }


    GetUserInfo(USER, NAME) {
        let xhr = new XMLHttpRequest();
        xhr.open('Get', `https://api.github.com/users/${USER}`, false);
        if (this.requestToken != null) {
            xhr.setRequestHeader('Authorization', `token ${this.requestToken}`)
        }
        xhr.send();
        this.requestTimesLeft = xhr.getResponseHeader('X-RateLimit-Remaining');
        return JSON.parse(xhr.responseText)[NAME];
    }

    GetUserRepos(VALUE) {
        let xhr = new XMLHttpRequest();
        xhr.open('Get', `https://api.github.com/users/${VALUE}/repos`, false);
        if (this.requestToken != null) {
            xhr.setRequestHeader('Authorization', `token ${this.requestToken}`)
        }
        xhr.send();
        this.requestTimesLeft = xhr.getResponseHeader('X-RateLimit-Remaining');
        return xhr.responseText;
    }

    GetUserEvents(VALUE) {
        let xhr = new XMLHttpRequest();
        xhr.open('Get', `https://api.github.com/users/${VALUE}/events`, false);
        if (this.requestToken != null) {
            xhr.setRequestHeader('Authorization', `token ${this.requestToken}`)
        }
        xhr.send();
        this.requestTimesLeft = xhr.getResponseHeader('X-RateLimit-Remaining');
        return xhr.responseText;
    }

    GetRepoInfo(REPO_NAME, NAME) {
        let xhr = new XMLHttpRequest();
        xhr.open('Get', `https://api.github.com/repos/${REPO_NAME}`, false);
        if (this.requestToken != null) {
            xhr.setRequestHeader('Authorization', `token ${this.requestToken}`)
        }
        xhr.send();
        this.requestTimesLeft = xhr.getResponseHeader('X-RateLimit-Remaining');
        return JSON.parse(xhr.responseText)[NAME];
    }

    GetRepoContent(REPO_NAME, PATH) {
        if (PATH[0] != '/') {
            return 'Only accept path start with `/` like : `/frist/second/file`.'
        }
        let xhr = new XMLHttpRequest();
        xhr.open('Get', `https://api.github.com/repos/${REPO_NAME}/contents${PATH}`, false);
        if (this.requestToken != null) {
            xhr.setRequestHeader('Authorization', `token ${this.requestToken}`)
        }
        xhr.send();
        this.requestTimesLeft = xhr.getResponseHeader('X-RateLimit-Remaining');
        return xhr.responseText;
    }

    SetRequestToken(TOKEN) {
        if (TOKEN == '' || TOKEN == 'your_token') {
            this.requestToken = null;
        } else {
            this.requestToken = TOKEN;
        }
    }
}

module.exports = ExampleExtension;