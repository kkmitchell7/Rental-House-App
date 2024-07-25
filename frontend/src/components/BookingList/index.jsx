export default function BookingList({ bookings }) {
    if (bookings == null){
        return;
    }
    else{
        return (
            <div className="">
              {bookings.map((booking, index) => {
                return (
                    <div className="p-4 mb-3 bg-light rounded">
                    <h6>{booking.start_date} <b style={{size:13}}>-</b> {booking.end_date}</h6>
                    <div>Nights: {booking.length}</div>
                    <div>Price: ${booking.price_paid.toFixed(2)}</div>
                    <div>Payment Status: {booking.payment_bool ? 'Paid' : 'Unpaid'}</div>
                    </div>
                );
              })}
            </div>
          );
    }
}