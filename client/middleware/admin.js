export default function ({ store, redirect }) {
    if (!store.$auth.user.admin) {
        // TODO: or redirect to some kind of Access Denied page, show a message somehow?
        return redirect('/');
    }
}
