casper.notebook_test(function () {
    // Note, \u001b is the unicode notation of octal \033 which is not officially in js
    var input = [
        "\u001b[0m[\u001b[0minfo\u001b[0m] \u001b[0mtext\u001b[0m",
        "\u001b[0m[\u001b[33mwarn\u001b[0m] \u001b[0m\tmore text\u001b[0m",
        "\u001b[0m[\u001b[33mwarn\u001b[0m] \u001b[0m  https://some/url/to/a/file.ext\u001b[0m",
        "\u001b[0m[\u001b[31merror\u001b[0m] \u001b[0m\u001b[0m",
        "\u001b[0m[\u001b[31merror\u001b[0m] \u001b[0m\teven more text\u001b[0m",
        "\u001b[?25hBuilding wheels for collected packages: scipy",
        "\x1b[38;5;28;01mtry\x1b[39;00m",
        "\u001b[0m[\u001b[31merror\u001b[0m] \u001b[0m\t\tand more more text\u001b[0m",
        "normal\x1b[43myellowbg\x1b[35mmagentafg\x1b[1mbold\x1b[49mdefaultbg\x1b[39mdefaultfg\x1b[22mnormal",
    ].join("\n");

    var output = [
        "[info] text",
        '[<span class="ansi-yellow-fg">warn</span>] \tmore text',
        '[<span class="ansi-yellow-fg">warn</span>]   https://some/url/to/a/file.ext',
        '[<span class="ansi-red-fg">error</span>] ',
        '[<span class="ansi-red-fg">error</span>] \teven more text',
        "Building wheels for collected packages: scipy",
        '<span class="ansi-bold" style="color: rgb(0,135,0)">try</span>',
        '[<span class="ansi-red-fg">error</span>] \t\tand more more text',
        'normal<span class="ansi-yellow-bg">yellowbg</span><span class="ansi-magenta-fg ansi-yellow-bg">magentafg</span><span class="ansi-magenta-intense-fg ansi-yellow-bg ansi-bold">bold</span><span class="ansi-magenta-intense-fg ansi-bold">defaultbg</span><span class="ansi-bold">defaultfg</span>normal',
    ].join("\n");

    var result = this.evaluate(function (input) {
        return IPython.utils.fixConsole(input);
    }, input);

    this.test.assertEquals(result, output, "IPython.utils.fixConsole() handles [0m correctly");
    
    this.thenEvaluate(function() {
        define('nbextensions/a', [], function() { window.a = true; });
        define('nbextensions/c', [], function() { window.c = true; });
        require(['base/js/utils'], function(utils) {
            utils.load_extensions('a', 'b', 'c');
        });
    }).then(function() {
        this.waitFor(function() {
            return this.evaluate(function() { return window.a; });
        });
        
        this.waitFor(function() {
            return this.evaluate(function() { return window.a; });
        });
    });
});