const subscriptions = {};
var crypto = require("crypto");
const webpush = require("web-push");

const vapidKeys = {
  privateKey: "DWxFCm9T2IJVMFIdCMOIhkIqLD8luPiGDYIStUXgzfQ",
  publicKey: "BJ2Oe_auOPYyWxDISh-gQyWaN7xTst3kCMolaSsA65YNLAmRjOw2ZkT7JgAmbuH7Bjfg6plmP1P5xXeim9Iqu_Q"
};

webpush.setVapidDetails("mailto:a.lozyuk@pixelplex.io", vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

function sendPushNotification(req, res) {
    const subscriptionId = req.params.id;
    const pushSubscription = subscriptions[subscriptionId];
    console.log('pushSubscription', pushSubscription);
    webpush
      .sendNotification(
        pushSubscription,
        JSON.stringify({
          title: "New Product Available",
          text: "HEY! Take a look at this brand new t-shirt!",
          tag: "new-product",
        })
      )
      .catch(err => {
        console.log(err);
      });
  
    res.status(202).json({});
  }

function handlePushNotificationSubscription(req, res) {
  const { expirationTime, ...subscriptionRequest } = req.body;
  const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
  subscriptions[susbscriptionId] = subscriptionRequest;
  req.params.id = susbscriptionId;
  sendPushNotification(req, res);
  // res.status(201).json({ id: susbscriptionId });
}


module.exports = { handlePushNotificationSubscription, sendPushNotification };