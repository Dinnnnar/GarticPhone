const UserCard = ({ photoUrl, username }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 0, 0.4)',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '8px',
            }}
        >
            <img
                src={photoUrl || 'https://via.placeholder.com/50'}
                alt={username}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{username}</span>
        </div>
    );
};

const UserLanding = () => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;
    const telegramUsername = `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
    const photoUrl = user.photo_url || 'https://via.placeholder.com/50';

    return (
        <>
            <UserCard photoUrl={photoUrl} username={telegramUsername} />
        </>
    );
};

export default UserLanding;
