export default function Home(props) {
    return (
        <div className='center'>
            <h1>Hello, { props.current_user.preferred_name }.</h1>
        </div>
    );
}