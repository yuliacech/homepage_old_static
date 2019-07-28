_doNotTrack = (
    window.doNotTrack == "1" ||
    navigator.doNotTrack == "yes" ||
    navigator.doNotTrack == "1" ||
    navigator.msDoNotTrack == "1" ||
    ('msTrackingProtectionEnabled' in window.external &&
        window.external.msTrackingProtectionEnabled())
);
if (!_doNotTrack) {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());

    gtag('config', 'UA-143386470-1', {'anonymize_ip': true});
}
