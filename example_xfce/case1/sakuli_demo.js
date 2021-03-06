/*
 * Sakuli - Testing and Monitoring-Tool for Websites and common UIs.
 *
 * Copyright 2013 - 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

_dynamicInclude($includeFolder);
var testCase = new TestCase(40, 60);
var env = new Environment();
var screen = new Region();
var appCalc = new Application("/usr/bin/gnome-calculator");
var appGedit = new Application("/usr/bin/gedit");

function checkCentOS() {
    var dist = env.runCommand('cat /etc/os-release').getOutput();
    if (dist.match(/NAME=.*CentOS.*/)) {
        Logger.logInfo('Detected distribution: CentOS  >> overwrite some image patterns');
        testCase.addImagePaths("centos");
    }
}

try {
    checkCentOS();
    _highlight(_link(/SSL M.*/));
    _highlight(_link("Logs"));
    _highlight(_link("Online Documentation"));
    _highlight(_link("Test Pages"));
    _highlight(_link("Sample Application"));
    testCase.endOfStep("Test Sahi landing page", 10);
    appCalc.open();

    screen.waitForImage("calculator.png", 5).highlight().mouseMove();

    env.type("525");
    env.sleep(2);
    var calcRegion = appCalc.getRegion();
    calcRegion.find("plus.png").click().type("100");
    calcRegion.find("result.png").click();
    screen.waitForImage("625", 5);
    testCase.endOfStep("Calculation", 20);

    appGedit.open();
    screen.waitForImage("gedit.png", 10);
    env.paste("Initial test passed. Sakuli, Sahi and Sikuli seem to work fine. Exiting...");
    testCase.endOfStep("Editor", 20);

} catch (e) {
    testCase.handleException(e);
} finally {
    // env.sleep(99999999);
    appCalc.close(true); //silent
    appGedit.kill(true); //silent, without exit prompt
    testCase.saveResult();
}