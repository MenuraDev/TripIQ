-- ============================================================
-- DATABASE CREATION
-- ============================================================

DROP DATABASE IF EXISTS tripiq;
CREATE DATABASE tripiq;
USE tripiq;


-- ============================================================
-- 1. USERS — Registered tourists only
-- ============================================================

CREATE TABLE users (
    user_id          INT AUTO_INCREMENT PRIMARY KEY,
    first_name       VARCHAR(100)    NOT NULL,
    last_name        VARCHAR(100)    NOT NULL,
    email            VARCHAR(255)    NOT NULL UNIQUE,
    password_hash    VARCHAR(255)    NOT NULL,
    phone            VARCHAR(20),
    nationality      VARCHAR(100),
    profile_image    VARCHAR(500),
    is_active        BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email  (email),
    INDEX idx_users_active (is_active)
);


-- ============================================================
-- 2. ADMINS — Separate table for security & role clarity
-- ============================================================

CREATE TABLE admins (
    admin_id         INT AUTO_INCREMENT PRIMARY KEY,
    first_name       VARCHAR(100)    NOT NULL,
    last_name        VARCHAR(100)    NOT NULL,
    email            VARCHAR(255)    NOT NULL UNIQUE,
    password_hash    VARCHAR(255)    NOT NULL,
    phone            VARCHAR(20),
    profile_image    VARCHAR(500),
    access_level     ENUM('super_admin', 'moderator', 'support')
                         NOT NULL DEFAULT 'moderator',
    is_active        BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login_at    TIMESTAMP       NULL,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_admins_email  (email),
    INDEX idx_admins_level  (access_level),
    INDEX idx_admins_active (is_active)
);


-- ============================================================
-- 3. CATEGORIES
-- ============================================================

CREATE TABLE categories (
    category_id      INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(100)    NOT NULL UNIQUE,
    description      TEXT,
    icon             VARCHAR(255),
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 4. DESTINATIONS
-- ============================================================

CREATE TABLE destinations (
    destination_id   INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(255)    NOT NULL,
    description      TEXT,
    latitude         DECIMAL(10, 8)  NOT NULL,
    longitude        DECIMAL(11, 8)  NOT NULL,
    province         VARCHAR(100),
    district         VARCHAR(100),
    address          VARCHAR(500),
    avg_visit_hours  DECIMAL(4, 2)   DEFAULT 2.00,
    entrance_fee     DECIMAL(10, 2)  DEFAULT 0.00,
    cluster_id       INT,
    is_active        BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_dest_cluster  (cluster_id),
    INDEX idx_dest_coords   (latitude, longitude),
    INDEX idx_dest_province (province),
    INDEX idx_dest_active   (is_active)
);


-- ============================================================
-- 5. DESTINATION IMAGES — Gallery (1 destination : N images)
-- ============================================================

CREATE TABLE destination_images (
    image_id         INT AUTO_INCREMENT PRIMARY KEY,
    destination_id   INT             NOT NULL,
    image_url        VARCHAR(500)    NOT NULL,
    alt_text         VARCHAR(255),
    caption          VARCHAR(500),
    display_order    INT             NOT NULL DEFAULT 0,
    is_primary       BOOLEAN         NOT NULL DEFAULT FALSE,
    uploaded_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id) ON DELETE CASCADE,

    INDEX idx_di_dest    (destination_id),
    INDEX idx_di_primary (destination_id, is_primary)
);


-- ============================================================
-- 6. DESTINATION ↔ CATEGORY (M:N)
-- ============================================================

CREATE TABLE destination_categories (
    destination_id   INT NOT NULL,
    category_id      INT NOT NULL,
    relevance_score  DECIMAL(3, 2)   DEFAULT 1.00,

    PRIMARY KEY (destination_id, category_id),
    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)      ON DELETE CASCADE
);


-- ============================================================
-- 7. DESTINATION FEATURE VECTORS (AI)
-- ============================================================

CREATE TABLE destination_features (
    destination_id   INT PRIMARY KEY,
    feature_vector   JSON            NOT NULL,
    last_computed    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id) ON DELETE CASCADE
);


-- ============================================================
-- 8. USER PREFERENCES (Content-Based Filtering)
-- ============================================================

CREATE TABLE user_preferences (
    preference_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    category_id      INT NOT NULL,
    weight           DECIMAL(3, 2)   NOT NULL DEFAULT 0.50,

    UNIQUE KEY uq_user_cat (user_id, category_id),
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)          ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES categories(category_id) ON DELETE CASCADE
);


-- ============================================================
-- 9–11. K-MEANS CLUSTERING SUPPORT
-- ============================================================

CREATE TABLE clustering_runs (
    run_id           INT AUTO_INCREMENT PRIMARY KEY,
    k_value          INT             NOT NULL,
    algorithm        VARCHAR(50)     DEFAULT 'K-Means',
    inertia          DECIMAL(15, 4),
    silhouette_score DECIMAL(6, 4),
    run_at           TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cluster_assignments (
    assignment_id    INT AUTO_INCREMENT PRIMARY KEY,
    run_id           INT NOT NULL,
    destination_id   INT NOT NULL,
    cluster_id       INT NOT NULL,
    distance_to_centroid DECIMAL(12, 6),

    FOREIGN KEY (run_id)
        REFERENCES clustering_runs(run_id)      ON DELETE CASCADE,
    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id) ON DELETE CASCADE,

    INDEX idx_ca_cluster (run_id, cluster_id)
);

CREATE TABLE cluster_centroids (
    centroid_id      INT AUTO_INCREMENT PRIMARY KEY,
    run_id           INT NOT NULL,
    cluster_id       INT NOT NULL,
    centroid_lat     DECIMAL(10, 8)  NOT NULL,
    centroid_lng     DECIMAL(11, 8)  NOT NULL,

    FOREIGN KEY (run_id)
        REFERENCES clustering_runs(run_id) ON DELETE CASCADE,

    UNIQUE KEY uq_run_cluster (run_id, cluster_id)
);


-- ============================================================
-- 12. DRIVERS
-- ============================================================

CREATE TABLE drivers (
    driver_id        INT AUTO_INCREMENT PRIMARY KEY,
    first_name       VARCHAR(100)    NOT NULL,
    last_name        VARCHAR(100)    NOT NULL,
    email            VARCHAR(255)    NOT NULL UNIQUE,
    password_hash    VARCHAR(255)    NOT NULL,
    phone            VARCHAR(20)     NOT NULL,
    license_number   VARCHAR(50)     NOT NULL UNIQUE,
    profile_image    VARCHAR(500),
    base_location    VARCHAR(255),
    base_latitude    DECIMAL(10, 8),
    base_longitude   DECIMAL(11, 8),
    avg_rating       DECIMAL(3, 2)   DEFAULT 0.00,
    total_trips      INT             DEFAULT 0,
    is_available     BOOLEAN         NOT NULL DEFAULT TRUE,
    is_active        BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_drv_available (is_available),
    INDEX idx_drv_active    (is_active),
    INDEX idx_drv_location  (base_latitude, base_longitude)
);


-- ============================================================
-- 13. VEHICLE TYPES
-- ============================================================

CREATE TABLE vehicle_types (
    vehicle_type_id  INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(100)    NOT NULL UNIQUE,
    max_passengers   INT             NOT NULL,
    max_luggage_kg   DECIMAL(6, 2),
    description      TEXT,
    icon             VARCHAR(255)
);


-- ============================================================
-- 14. VEHICLES
-- ============================================================

CREATE TABLE vehicles (
    vehicle_id       INT AUTO_INCREMENT PRIMARY KEY,
    driver_id        INT NOT NULL,
    vehicle_type_id  INT NOT NULL,
    make             VARCHAR(100),
    model            VARCHAR(100),
    year             YEAR,
    plate_number     VARCHAR(20)     NOT NULL UNIQUE,
    color            VARCHAR(50),
    ac_available     BOOLEAN         DEFAULT TRUE,
    image_url        VARCHAR(500),
    rate_per_km      DECIMAL(10, 2)  NOT NULL,
    rate_per_day     DECIMAL(10, 2),
    is_active        BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)              ON DELETE CASCADE,
    FOREIGN KEY (vehicle_type_id)
        REFERENCES vehicle_types(vehicle_type_id)  ON DELETE RESTRICT,

    INDEX idx_veh_driver (driver_id),
    INDEX idx_veh_type   (vehicle_type_id),
    INDEX idx_veh_active (is_active)
);


-- ============================================================
-- 15. DRIVER AVAILABILITY / BLACKOUT DATES
-- ============================================================

CREATE TABLE driver_availability (
    availability_id  INT AUTO_INCREMENT PRIMARY KEY,
    driver_id        INT  NOT NULL,
    date             DATE NOT NULL,
    is_available     BOOLEAN NOT NULL DEFAULT FALSE,

    UNIQUE KEY uq_drv_date (driver_id, date),
    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id) ON DELETE CASCADE
);


-- ============================================================
-- 16. ITINERARIES
-- ============================================================

CREATE TABLE itineraries (
    itinerary_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    title             VARCHAR(255),
    start_date        DATE            NOT NULL,
    end_date          DATE            NOT NULL,
    num_travelers     INT             NOT NULL DEFAULT 1,
    total_distance_km DECIMAL(10, 2),
    estimated_cost    DECIMAL(12, 2),
    generation_method ENUM('ai_generated', 'user_customized', 'manual')
                          DEFAULT 'ai_generated',
    status            ENUM('draft', 'confirmed', 'in_progress',
                           'completed', 'cancelled')
                          NOT NULL DEFAULT 'draft',
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,

    INDEX idx_itin_user   (user_id),
    INDEX idx_itin_status (status),
    INDEX idx_itin_dates  (start_date, end_date)
);


-- ============================================================
-- 17. ITINERARY DAYS
-- ============================================================

CREATE TABLE itinerary_days (
    day_id           INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id     INT  NOT NULL,
    day_number       INT  NOT NULL,
    date             DATE NOT NULL,
    day_distance_km  DECIMAL(10, 2),
    day_cost         DECIMAL(10, 2),
    notes            TEXT,

    UNIQUE KEY uq_itin_day (itinerary_id, day_number),
    FOREIGN KEY (itinerary_id)
        REFERENCES itineraries(itinerary_id) ON DELETE CASCADE
);


-- ============================================================
-- 18. ITINERARY DAY LOCATIONS (Nearest-Neighbor output)
-- ============================================================

CREATE TABLE itinerary_day_locations (
    day_location_id       INT AUTO_INCREMENT PRIMARY KEY,
    day_id                INT NOT NULL,
    destination_id        INT NOT NULL,
    visit_order           INT NOT NULL,
    arrival_time          TIME,
    departure_time        TIME,
    distance_from_prev_km DECIMAL(10, 2),
    travel_time_mins      INT,
    notes                 TEXT,

    UNIQUE KEY uq_day_order (day_id, visit_order),
    FOREIGN KEY (day_id)
        REFERENCES itinerary_days(day_id)        ON DELETE CASCADE,
    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id)  ON DELETE RESTRICT,

    INDEX idx_idl_dest (destination_id)
);


-- ============================================================
-- 19. ITINERARY RECOMMENDATIONS (AI suggestions)
-- ============================================================

CREATE TABLE itinerary_recommendations (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id      INT NOT NULL,
    destination_id    INT NOT NULL,
    similarity_score  DECIMAL(5, 4),
    cluster_id        INT,
    is_accepted       BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (itinerary_id)
        REFERENCES itineraries(itinerary_id)    ON DELETE CASCADE,
    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id) ON DELETE CASCADE,

    INDEX idx_rec_score (itinerary_id, similarity_score DESC)
);


-- ============================================================
-- 20. BOOKINGS
-- ============================================================

CREATE TABLE bookings (
    booking_id        INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id      INT NOT NULL,
    user_id           INT NOT NULL,
    driver_id         INT,
    vehicle_id        INT,
    pickup_location   VARCHAR(500),
    pickup_latitude   DECIMAL(10, 8),
    pickup_longitude  DECIMAL(11, 8),
    pickup_datetime   DATETIME        NOT NULL,
    dropoff_datetime  DATETIME,
    total_distance_km DECIMAL(10, 2),
    base_fare         DECIMAL(12, 2)  NOT NULL,
    tax_amount        DECIMAL(10, 2)  DEFAULT 0.00,
    discount_amount   DECIMAL(10, 2)  DEFAULT 0.00,
    total_amount      DECIMAL(12, 2)  NOT NULL,
    status            ENUM('pending', 'confirmed', 'driver_assigned',
                           'in_progress', 'completed', 'cancelled')
                          NOT NULL DEFAULT 'pending',
    cancellation_reason TEXT,
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (itinerary_id)
        REFERENCES itineraries(itinerary_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)            ON DELETE CASCADE,
    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)        ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(vehicle_id)      ON DELETE SET NULL,

    INDEX idx_bk_user   (user_id),
    INDEX idx_bk_driver (driver_id),
    INDEX idx_bk_status (status),
    INDEX idx_bk_dates  (pickup_datetime)
);


-- ============================================================
-- 21. PAYMENT METHODS (tokenized cards, wallets)
-- ============================================================

CREATE TABLE payment_methods (
    payment_method_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    method_type       ENUM('credit_card', 'debit_card',
                           'bank_transfer', 'payhere_wallet')
                          NOT NULL,
    card_last_four    CHAR(4),
    card_brand        VARCHAR(50),
    expiry_month      TINYINT,
    expiry_year       SMALLINT,
    is_default        BOOLEAN         NOT NULL DEFAULT FALSE,
    token             VARCHAR(500),
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE,

    INDEX idx_pm_user (user_id)
);


-- ============================================================
-- 22. PAYMENTS
-- ============================================================

CREATE TABLE payments (
    payment_id        INT AUTO_INCREMENT PRIMARY KEY,
    booking_id        INT NOT NULL,
    payment_method_id INT,
    gateway           VARCHAR(50)     DEFAULT 'PayHere',
    gateway_txn_id    VARCHAR(255),
    amount            DECIMAL(12, 2)  NOT NULL,
    currency          CHAR(3)         DEFAULT 'LKR',
    status            ENUM('pending', 'processing', 'completed',
                           'failed', 'refunded')
                          NOT NULL DEFAULT 'pending',
    paid_at           TIMESTAMP       NULL,
    refund_amount     DECIMAL(12, 2)  DEFAULT 0.00,
    refunded_at       TIMESTAMP       NULL,
    receipt_url       VARCHAR(500),
    gateway_response  JSON,
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)               ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods(payment_method_id) ON DELETE SET NULL,

    INDEX idx_pay_booking (booking_id),
    INDEX idx_pay_status  (status),
    INDEX idx_pay_gateway (gateway_txn_id)
);


-- ============================================================
-- 23. REVIEWS
-- ============================================================

CREATE TABLE reviews (
    review_id         INT AUTO_INCREMENT PRIMARY KEY,
    booking_id        INT NOT NULL,
    user_id           INT NOT NULL,
    driver_id         INT,
    overall_rating    TINYINT         NOT NULL
                          CHECK (overall_rating BETWEEN 1 AND 5),
    driver_rating     TINYINT
                          CHECK (driver_rating BETWEEN 1 AND 5),
    vehicle_rating    TINYINT
                          CHECK (vehicle_rating BETWEEN 1 AND 5),
    itinerary_rating  TINYINT
                          CHECK (itinerary_rating BETWEEN 1 AND 5),
    title             VARCHAR(255),
    comment           TEXT,
    is_draft          BOOLEAN         NOT NULL DEFAULT FALSE,
    is_published      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)       ON DELETE CASCADE,
    FOREIGN KEY (driver_id)
        REFERENCES drivers(driver_id)   ON DELETE SET NULL,

    UNIQUE KEY uq_booking_review (booking_id, user_id),
    INDEX idx_rev_user   (user_id),
    INDEX idx_rev_driver (driver_id),
    INDEX idx_rev_draft  (is_draft)
);


-- ============================================================
-- 24. REVIEW ↔ DESTINATION (per-spot micro-reviews)
-- ============================================================

CREATE TABLE review_destinations (
    review_dest_id    INT AUTO_INCREMENT PRIMARY KEY,
    review_id         INT NOT NULL,
    destination_id    INT NOT NULL,
    rating            TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment           TEXT,

    FOREIGN KEY (review_id)
        REFERENCES reviews(review_id)            ON DELETE CASCADE,
    FOREIGN KEY (destination_id)
        REFERENCES destinations(destination_id)  ON DELETE CASCADE,

    UNIQUE KEY uq_rev_dest (review_id, destination_id)
);


-- ============================================================
-- 25. ADMIN AUDIT LOG — now references admins table
-- ============================================================

CREATE TABLE admin_audit_log (
    log_id            INT AUTO_INCREMENT PRIMARY KEY,
    admin_id          INT NOT NULL,
    action            VARCHAR(100)    NOT NULL,
    entity_type       VARCHAR(50),
    entity_id         INT,
    old_value         JSON,
    new_value         JSON,
    ip_address        VARCHAR(45),
    performed_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id)
        REFERENCES admins(admin_id) ON DELETE CASCADE,

    INDEX idx_audit_admin  (admin_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_time   (performed_at)
);


-- ============================================================
-- 26. SYSTEM SETTINGS — updated_by → admins
-- ============================================================

CREATE TABLE system_settings (
    setting_key       VARCHAR(100)    PRIMARY KEY,
    setting_value     TEXT            NOT NULL,
    description       VARCHAR(500),
    updated_by        INT,
    updated_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (updated_by)
        REFERENCES admins(admin_id) ON DELETE SET NULL
);


-- ============================================================
-- 27. NOTIFICATIONS — supports user / driver / admin recipients
-- ============================================================

CREATE TABLE notifications (
    notification_id   INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type    ENUM('user', 'driver', 'admin') NOT NULL,
    recipient_id      INT             NOT NULL,
    title             VARCHAR(255)    NOT NULL,
    message           TEXT            NOT NULL,
    type              ENUM('booking', 'payment', 'itinerary',
                           'review', 'system')
                          NOT NULL,
    reference_type    VARCHAR(50),
    reference_id      INT,
    is_read           BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notif_recipient (recipient_type, recipient_id, is_read),
    INDEX idx_notif_created   (created_at)
);
