const mongoose = require('mongoose');
const systemUser = mongoose.model('system_user');
const commonUtils = require('./../common/utils');
const nodemailer = require('nodemailer');
const emailsCfg = global.appConfig.notificationEmailCfg;
const transporter = nodemailer.createTransport({
    service: "Yandex",
    auth: {
        user: emailsCfg.login,
        pass: emailsCfg.password
    }
});

module.exports = {
    sendEventRequestNewUserMsgNotification,
    sendNewEventRequestNotification
};

async function sendEventRequestNewUserMsgNotification(req, eventRequestData, messageData) {
    const textData = getEventRequestTextData(req, eventRequestData);
    const title = `Поступило новое сообщение в заявке от участника по региону ${textData.regionName}`;
    const body = `В заявке ${textData.adminLink} поступило новое сообщение от участника.<br/> Текст сообщения: ${messageData.text}.${getLogoHtml(req)}` ;

    sendEmailForRegionResponsibleSystemUsers(eventRequestData.region, title, body);
};

async function sendNewEventRequestNotification(req, eventRequestData) {
    const textData = getEventRequestTextData(req, eventRequestData);
    const title = `Поступило новая заявка по региону ${textData.regionName}`;
    const body = `Создана новая заявка: ${textData.adminLink}</a>.${getLogoHtml(req)}`;

    sendEmailForRegionResponsibleSystemUsers(eventRequestData.region, title, body);
};

function getEventRequestTextData(req, eventRequestData) {
    const adminUrl = `${commonUtils.getFullDomainName(req)}/admin/workspace#/main/eventRequests/edit/${eventRequestData._id.toString()}`;
    return {
        regionName: textResources.eventRequestRegions[eventRequestData.region],
        adminLink: `<a href="${adminUrl}" target="_blank">${adminUrl}</a>`
    };
};

function getLogoHtml(req) {
    return `<br/><img src="${commonUtils.getFullDomainName(req)}/resources/images/logo.png"/>`;
};

async function sendEmailForRegionResponsibleSystemUsers(region, title, body) {
    return new Promise(resolve => {
        const conditions = [{responsibleForRegions: region}];
        [{$ne: null}, {$exists: true}, {$ne: ''}].forEach(condition => conditions.push({email: condition}));
        systemUser.find({$and: conditions}, (err, systemUsersData) => {
            systemUsersData.forEach(su => {
                sendEmail(su.email, title, body);
            });
            resolve();
        });
    });
};

function sendEmail(toEmail, title, body) {
    transporter.sendMail({
        from: emailsCfg.login,
        to: toEmail,
        subject: title,
        html: body
    });
};