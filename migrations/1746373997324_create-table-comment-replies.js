/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comment_replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment_id: {
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

  pgm.addConstraint("comment_replies", "", {
    foreignKeys: [
      {
        columns: "thread_id",
        referencesConstraintName:
          "fk_comment_replies.thread_id.comment_replies_thread_id",
        references: "threads(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      {
        columns: "comment_id",
        referencesConstraintName:
          "fk_comment_replies.comment_id.comment_replies_comment_id",
        references: "comments(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      {
        columns: "owner",
        referencesConstraintName:
          "fk_comment_replies.owner.comment_replies_owner",
        references: "users(id)",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comment_replies");
};
