# --- !Ups

-- =========================
-- TABLES
-- =========================

create table departments (
                             id bigint auto_increment not null,
                             code varchar(50) not null,
                             name varchar(100) not null,
                             description varchar(255),
                             is_active boolean not null,
                             created_at datetime(6) not null,
                             updated_at datetime(6) not null,
                             constraint uq_departments_code unique (code),
                             constraint uq_departments_name unique (name),
                             constraint pk_departments primary key (id)
);

create table users (
                       id bigint auto_increment not null,
                       username varchar(100) not null,
                       email varchar(255) not null,
                       password varchar(255) not null,
                       role varchar(50) not null,
                       department_id bigint,
                       is_active boolean not null,
                       created_at datetime(6) not null,
                       updated_at datetime(6) not null,
                       constraint uq_users_username unique (username),
                       constraint uq_users_email unique (email),
                       constraint pk_users primary key (id)
);

create table assets (
                        id bigint auto_increment not null,
                        asset_code varchar(50) not null,
                        serial_number varchar(255) not null,
                        name varchar(255) not null,
                        category varchar(50) not null,
                        status varchar(50) not null,
                        purchase_date date,
                        description varchar(1000),
                        is_active boolean not null,
                        created_at datetime(6) not null,
                        updated_at datetime(6) not null,
                        constraint uq_assets_asset_code unique (asset_code),
                        constraint uq_assets_serial_number unique (serial_number),
                        constraint pk_assets primary key (id)
);

create table asset_assignments (
                                   id bigint auto_increment not null,
                                   asset_id bigint not null,
                                   user_id bigint not null,
                                   assigned_by bigint not null,
                                   assigned_date datetime(6) not null,
                                   returned_date datetime(6),
                                   status varchar(50) not null,
                                   is_active boolean not null,
                                   created_at datetime(6) not null,
                                   updated_at datetime(6) not null,
                                   constraint pk_asset_assignments primary key (id)
);

create table maintenance_requests (
                                      id bigint auto_increment not null,
                                      asset_id bigint not null,
                                      user_id bigint not null,
                                      approved_by bigint,
                                      description varchar(500) not null,
                                      status varchar(50) not null,
                                      approved_at datetime(6),
                                      is_active boolean not null,
                                      created_at datetime(6) not null,
                                      updated_at datetime(6) not null,
                                      constraint pk_maintenance_requests primary key (id)
);

create table audit_logs (
                            id bigint auto_increment not null,
                            action varchar(100) not null,
                            entity_type varchar(100) not null,
                            entity_id bigint not null,
                            performed_by bigint not null,
                            created_at datetime(6) not null,
                            constraint pk_audit_logs primary key (id)
);

-- =========================
-- FOREIGN KEYS
-- =========================

alter table users
    add constraint fk_users_department
        foreign key (department_id) references departments(id);

alter table asset_assignments
    add constraint fk_assignment_asset
        foreign key (asset_id) references assets(id);

alter table asset_assignments
    add constraint fk_assignment_user
        foreign key (user_id) references users(id);

alter table asset_assignments
    add constraint fk_assignment_assigned_by
        foreign key (assigned_by) references users(id);

alter table maintenance_requests
    add constraint fk_maintenance_asset
        foreign key (asset_id) references assets(id);

alter table maintenance_requests
    add constraint fk_maintenance_user
        foreign key (user_id) references users(id);

alter table maintenance_requests
    add constraint fk_maintenance_approved_by
        foreign key (approved_by) references users(id);

alter table audit_logs
    add constraint fk_audit_user
        foreign key (performed_by) references users(id);

-- =========================
-- COLUMN ADDITION (FIXED POSITION)
-- =========================

alter table maintenance_requests
    add column resolved_at datetime(6);

-- =========================
-- INDEXES
-- =========================

create unique index idx_users_username on users(username);
create index idx_users_department_id on users(department_id);

create unique index idx_assets_serial_number on assets(serial_number);
create index idx_assets_status on assets(status);

create index idx_asset_assignments_asset_id on asset_assignments(asset_id);
create index idx_asset_assignments_user_id on asset_assignments(user_id);
create index idx_asset_assignments_returned_date on asset_assignments(returned_date);

create index idx_maintenance_requests_asset_id on maintenance_requests(asset_id);
create index idx_maintenance_requests_user_id on maintenance_requests(user_id);
create index idx_maintenance_requests_status on maintenance_requests(status);


# --- !Downs

-- =========================
-- INDEXES
-- =========================

drop index idx_maintenance_requests_status on maintenance_requests;
drop index idx_maintenance_requests_user_id on maintenance_requests;
drop index idx_maintenance_requests_asset_id on maintenance_requests;

drop index idx_asset_assignments_returned_date on asset_assignments;
drop index idx_asset_assignments_user_id on asset_assignments;
drop index idx_asset_assignments_asset_id on asset_assignments;

drop index idx_assets_status on assets;
drop index idx_assets_serial_number on assets;

drop index idx_users_department_id on users;
drop index idx_users_username on users;

-- =========================
-- COLUMN
-- =========================

alter table maintenance_requests
drop column resolved_at;

-- =========================
-- FOREIGN KEYS
-- =========================

alter table audit_logs drop foreign key fk_audit_user;

alter table maintenance_requests drop foreign key fk_maintenance_approved_by;
alter table maintenance_requests drop foreign key fk_maintenance_user;
alter table maintenance_requests drop foreign key fk_maintenance_asset;

alter table asset_assignments drop foreign key fk_assignment_assigned_by;
alter table asset_assignments drop foreign key fk_assignment_user;
alter table asset_assignments drop foreign key fk_assignment_asset;

alter table users drop foreign key fk_users_department;

-- =========================
-- TABLES
-- =========================

drop table if exists audit_logs;
drop table if exists maintenance_requests;
drop table if exists asset_assignments;
drop table if exists assets;
drop table if exists users;
drop table if exists departments;
