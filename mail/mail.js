var credentials = require('../secret/credentials.js');
var xoauth2 = require('xoauth2');
var nodemailer = require('nodemailer');

var mailFrom = credentials.gmail.user;
var mailTo;
var mailSubject;
var mailBody;

var mailFromAdmin = credentials.gmail.user;
var mailToAdmin = credentials.gmail.user;
var mailSubjectAdmin;
var mailBodyAdmin;


var mailTransport = nodemailer.createTransport({

  host: "smtp.gmail.com",

  auth: {
    type: "OAuth2",
    user: credentials.gmail.user,
    clientId: credentials.gmail.client_id,
    clientSecret: credentials.gmail.client_secret,
    refreshToken: credentials.gmail.refresh_token,
    accessToken: credentials.gmail.access_token,
    expires: credentials.gmail.expires_in,
    tokenType: credentials.gmail.token_type
  }

});

var avisoLegal = "\n\n\nEn cumplimiento de lo establecido en la L.O. 15/1999 de Protección de Datos de Carácter Personal " +
"A Cova do Raposo le informa que sus datos han sido incorporados a un fichero automatizado " +
"con la finalidad de prestar y ofrecer nuestros servicios. Los datos recogidos son almacenados " +
"bajo la confidencialidad y las medidas de seguridad legalmente establecidas y no serán cedidos ni " +
"compartidos con empresas ni entidades ajenas a A Cova do Raposo. Igualmente deseamos informarle que " +
"podrá ejercer los derechos de acceso, rectificación cancelación u oposición a través de los siguientes medios:\n" +
"\n     •E-mail: acovadoraposo@gmail.com\n" +
"     •Comunicación escrita al responsable legal del fichero: A Cova do Raposo - Rúa Noreas, 12, Lugo 27001 ";

module.exports = {

    dummyFun: function(){
        return "hola";
    },
    dummyFuBoolean: function(mailTo,headhost,token){
        console.log(mailTo);
        console.log(headhost);
        console.log(token);
        return true;
    },
    sendPasswordReset: function(mailTo,headhost,token){

        var confUser = {};

        mailSubject = "Reset do contrasinal";
        mailBody = 'Recibiche este correo porque ti (ou outra persoa) fixo unha peticion para resetear o contrasinal da tua conta.\n\n' +
          'Por favor, fai clic no siguinte enlace ou pega isto no teu navegador para completar o proceso:\n\n' +
          'http://' + headhost + '/reset/' + token + '\n\n' +
          'Se non pediche isto, por favor ignora este correo e o teu contrasinal non será modificado.\n';

        mailBody = mailBody.concat(avisoLegal);

        confUser.from = mailFrom;
        confUser.to = mailTo;
        confUser.subject = mailSubject;
        confUser.text = mailBody;

        mailTransport.sendMail(confUser, function(err){
            if(err) {
                console.error( 'Incapaz de enviar correo: ' + err );
                return false;
            }
        });
        mailTransport.close();
        return true;

    },
    sendPasswordResetConfirmation: function(mailTo){
        var confUser = {};

        mailSubject = "O teu contrasinal cambiouse";
        mailBody = 'Ola,\n\n' +
          'Isto é unha confirmación de que o contrasinal da tua conta ' + mailTo + ' acaba de cambiarse.\n';

        mailBody = mailBody.concat(avisoLegal);

        confUser.from = mailFrom;
        confUser.to = mailTo;
        confUser.subject = mailSubject;
        confUser.text = mailBody;
        mailTransport.sendMail(confUser, function(err){
            if(err) {
                console.error( 'Incapaz de enviar correo: ' + err );
                return false;
            }
        });
        mailTransport.close();
        return true;
    },
    sendMail: function(currentUser, order){
        try {
            var confUser = {};
            var confAdmin = {};


            if (currentUser && currentUser.rank){
                mailSubject = "Actualización do pedido";
                mailBody = 'Ola ' + order.nameUser + '\r\nSon O Raposo e quero informate de que o estado do teu pedido ha cambiado a - ' +
                              order.state +
                             '\r\nE recorda que se tes calquera duda a min non me lies...mellor chama a Clara.';

                mailBody = mailBody.concat(avisoLegal);

                // Send mail to user only
                confUser.from = mailFrom;
                confUser.to = order.email;
                confUser.subject = mailSubject;
                confUser.text = mailBody;

                mailTransport.sendMail(confUser, function(err){
                    if(err) console.error( 'Unable to send email: ' + err );
                });

                mailTransport.close();

            }else if (currentUser && order.state === 'pendiente') {
                mailSubject = "Pedido";
                mailBody = 'Ola ' + order.nameUser + '\n\nSon O Raposo e mandoche este correo para dicirte que ' +
                           'acabas de facer un pedido.\n\nDetalles do pedido \n     Número - ' + order._id +
                           '\n     Data - ' + order.date + '\n' +
                           '\nGraciñas por confiar en mi...bueno e tamén en Clara.\r\n';

                mailBody = mailBody.concat(avisoLegal);

                mailSubjectAdmin = 'Novo pedido';
                mailBodyAdmin = 'Ola Clara\r\n' + order.nameUser + ' acaba de facer un novo pedido có num.' + order._id +
                             ' e data ' + order.date;

                // Send mail to user
                confUser.from = mailFrom;
                confUser.to = order.email;
                confUser.subject = mailSubject;
                confUser.text = mailBody;

                mailTransport.sendMail(confUser, function(err){
                    if(err) console.error( 'Unable to send email: ' + err );
                });

                // and to the admin
                confAdmin.from = mailFromAdmin;
                confAdmin.to = mailToAdmin;
                confAdmin.subject = mailSubjectAdmin;
                confAdmin.text = mailBodyAdmin;

                mailTransport.sendMail(confAdmin, function(err){
                    if(err) console.error( 'Unable to send email: ' + err );
                });

                mailTransport.close();


            }else if (currentUser && order.state === 'anulado'){
                mailSubject = "Auto anulación de pedido";
                mailBody = 'Ola ' + order.nameUser + '\r\nAcabas de anular o teu pedido -num.' + order._id +
                             ' feito o ' + order.date +
                             '\r\nEspero que non teñas ningunha queixa pero recorda que si eso...mellor chama a Clara.';

                mailBody = mailBody.concat(avisoLegal);

                mailSubjectAdmin = 'Auto anulación de pedido';
                mailBodyAdmin = 'Ola Clara\r\n' + order.nameUser + ' acaba de anular o pedido - num.' + order._id +
                             ' feito o ' + order.date + '\r\nAsí vay mal a cousa!!!';

                // Send mail to user
                confUser.from = mailFrom;
                confUser.to = order.email;
                confUser.subject = mailSubject;
                confUser.text = mailBody;

                mailTransport.sendMail(confUser, function(err){
                    if(err) console.error( 'Unable to send email: ' + err );
                });

                // and to the admin
                confAdmin.from = mailFromAdmin;
                confAdmin.to = mailToAdmin;
                confAdmin.subject = mailSubjectAdmin;
                confAdmin.text = mailBodyAdmin;

                mailTransport.sendMail(confAdmin, function(err){
                    if(err) console.error( 'Unable to send email: ' + err );
                });

                mailTransport.close();
            }

            return true;

        }catch(err){
            console.log("Error: sendMail");
            return false;
        }
    }
};