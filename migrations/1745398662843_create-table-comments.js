/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_deleted: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint("comments", "", {
    foreignKeys: [
      {
        columns: "thread_id",
        referencesConstraintName: "fk_comments.threads_id.comments_thread_id",
        references: "threads(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      {
        columns: "owner",
        referencesConstraintName: "fk_comments.users_id.comments_owner",
        references: "users(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
